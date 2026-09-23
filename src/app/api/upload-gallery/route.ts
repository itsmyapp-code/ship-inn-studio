import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

// Helper to get GitHub config
function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN || process.env.OST_GITHUB_TOKEN || process.env.OST_TOKEN
  const owner = process.env.OST_REPO_OWNER || 'itsmyapp-code'
  const repo = process.env.OST_REPO_SLUG || 'ship-inn-studio'
  const branch = process.env.OST_REPO_BRANCH || 'main'
  return { token, owner, repo, branch }
}

// GET: Retrieve list of all gallery items for admin manager
export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), 'outstatic', 'content', 'gallery')
    if (!fs.existsSync(galleryDir)) {
      return NextResponse.json({ success: true, items: [] })
    }

    const files = fs.readdirSync(galleryDir)
    const items = files
      .filter(file => (file.endsWith('.md') || file.endsWith('.mdx')) && !file.startsWith('.'))
      .map(file => {
        const filePath = path.join(galleryDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data } = matter(fileContent)
        const slug = file.replace(/\.mdx?$/, '')
        return {
          slug: data.slug || slug,
          title: data.title || slug,
          category: data.category || 'Other',
          description: data.description || '',
          coverImage: data.coverImage || '',
          status: data.status || 'published',
          publishedAt: data.publishedAt || ''
        }
      })
      .sort((a, b) => {
        if (a.publishedAt && b.publishedAt) {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        }
        return a.title.localeCompare(b.title)
      })

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Error listing gallery items:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve gallery items'
    }, { status: 500 })
  }
}

// POST: Upload single gallery image and create Outstatic document
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = ((formData.get('title') as string) || 'Ship Inn Gallery Photo').trim()
    const category = ((formData.get('category') as string) || 'Interior').trim()
    const description = ((formData.get('description') as string) || '').trim()
    const status = ((formData.get('status') as string) || 'published').trim()

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file uploaded' }, { status: 400 })
    }

    const validExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif']
    const originalExt = path.extname(file.name).toLowerCase()
    if (!validExtensions.includes(originalExt)) {
      return NextResponse.json({
        success: false,
        error: `Invalid file type. Supported types: ${validExtensions.join(', ')}`
      }, { status: 400 })
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (!baseSlug) {
      baseSlug = `gallery-${Date.now()}`
    }

    // Sanitize file name
    const rawFileName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9.\-_]/g, '-')
    const sanitizedFileName = `${rawFileName}-${Date.now()}${originalExt}`
    const imagePath = `/images/gallery/${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const publishedAt = new Date().toISOString()
    const markdownContent = `---
title: '${title.replace(/'/g, "\\'")}'
status: '${status}'
author:
  name: 'Admin'
  picture: ''
slug: '${baseSlug}'
description: '${description.replace(/'/g, "\\'")}'
coverImage: '${imagePath}'
publishedAt: '${publishedAt}'
category: '${category.replace(/'/g, "\\'")}'
---

Photo added via Gallery Manager.
`

    let savedLocally = false
    try {
      const publicGalleryDir = path.join(process.cwd(), 'public', 'images', 'gallery')
      if (!fs.existsSync(publicGalleryDir)) {
        fs.mkdirSync(publicGalleryDir, { recursive: true })
      }
      fs.writeFileSync(path.join(publicGalleryDir, sanitizedFileName), buffer)

      const outstaticGalleryDir = path.join(process.cwd(), 'outstatic', 'content', 'gallery')
      if (!fs.existsSync(outstaticGalleryDir)) {
        fs.mkdirSync(outstaticGalleryDir, { recursive: true })
      }
      fs.writeFileSync(path.join(outstaticGalleryDir, `${baseSlug}.md`), markdownContent, 'utf8')
      savedLocally = true
    } catch (fsErr) {
      console.log('Local filesystem write failed or in read-only environment:', fsErr)
    }

    // GitHub Commit Sync
    const { token: githubToken, owner: repoOwner, repo: repoSlug, branch } = getGitHubConfig()
    let githubCommitted = false

    if (githubToken) {
      try {
        const headers = {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Ship-Inn-Gallery-Uploader'
        }

        const commitGitHubFile = async (filePath: string, contentBase64: string, message: string) => {
          let sha: string | undefined
          try {
            const getRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoSlug}/contents/${filePath}?ref=${branch}`, { headers })
            if (getRes.ok) {
              const data = await getRes.json()
              sha = data.sha
            }
          } catch {
            // New file, no existing sha
          }

          const putRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoSlug}/contents/${filePath}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              message,
              content: contentBase64,
              branch,
              ...(sha ? { sha } : {})
            })
          })

          return putRes.ok
        }

        const imageBase64 = buffer.toString('base64')
        const mdBase64 = Buffer.from(markdownContent, 'utf8').toString('base64')

        const imgOk = await commitGitHubFile(`public/images/gallery/${sanitizedFileName}`, imageBase64, `chore(gallery): upload ${sanitizedFileName}`)
        const mdOk = await commitGitHubFile(`outstatic/content/gallery/${baseSlug}.md`, mdBase64, `feat(gallery): add ${title}`)

        githubCommitted = imgOk && mdOk
      } catch (ghErr) {
        console.error('Error committing gallery photo to GitHub:', ghErr)
      }
    }

    return NextResponse.json({
      success: true,
      fileName: sanitizedFileName,
      imagePath,
      slug: baseSlug,
      title,
      category,
      savedLocally,
      githubCommitted,
      message: `"${title}" has been successfully added to the Gallery!`
    })
  } catch (error) {
    console.error('Error processing gallery upload:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during gallery upload'
    }, { status: 500 })
  }
}

// DELETE: Delete a gallery item from Outstatic and GitHub
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required' }, { status: 400 })
    }

    let deletedLocally = false
    try {
      const mdPath = path.join(process.cwd(), 'outstatic', 'content', 'gallery', `${slug}.md`)
      const mdxPath = path.join(process.cwd(), 'outstatic', 'content', 'gallery', `${slug}.mdx`)
      if (fs.existsSync(mdPath)) {
        fs.unlinkSync(mdPath)
        deletedLocally = true
      } else if (fs.existsSync(mdxPath)) {
        fs.unlinkSync(mdxPath)
        deletedLocally = true
      }
    } catch (fsErr) {
      console.log('Local delete failed:', fsErr)
    }

    // GitHub Delete Sync
    const { token: githubToken, owner: repoOwner, repo: repoSlug, branch } = getGitHubConfig()
    let githubDeleted = false

    if (githubToken) {
      try {
        const headers = {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Ship-Inn-Gallery-Uploader'
        }

        const deleteGitHubFile = async (filePath: string, message: string) => {
          try {
            const getRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoSlug}/contents/${filePath}?ref=${branch}`, { headers })
            if (getRes.ok) {
              const data = await getRes.json()
              const sha = data.sha
              const delRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoSlug}/contents/${filePath}`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({
                  message,
                  sha,
                  branch
                })
              })
              return delRes.ok
            }
          } catch {
            return false
          }
          return false
        }

        const mdDel = await deleteGitHubFile(`outstatic/content/gallery/${slug}.md`, `chore(gallery): delete ${slug}`)
        githubDeleted = mdDel
      } catch (ghErr) {
        console.error('Error deleting from GitHub:', ghErr)
      }
    }

    return NextResponse.json({
      success: true,
      deletedLocally,
      githubDeleted,
      message: `Gallery item "${slug}" removed successfully.`
    })
  } catch (error) {
    console.error('Error removing gallery item:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete gallery item'
    }, { status: 500 })
  }
}
