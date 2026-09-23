import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const slug = (formData.get('slug') as string) || 'lunch-menu'
    const title = (formData.get('title') as string) || 'Lunch Menu'
    const subtitle = (formData.get('subtitle') as string) || ''
    const order = Number(formData.get('order')) || 1

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only .pdf files are supported.' 
      }, { status: 400 })
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, '')
    const pdfPath = `/menus/${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const markdownContent = `---
title: '${title.replace(/'/g, "\\'")}'
status: 'published'
author:
  name: 'Admin'
  picture: ''
slug: '${slug}'
description: 'Updated menu for The Ship Inn'
subtitle: '${subtitle.replace(/'/g, "\\'")}'
pdfFile: '${pdfPath}'
order: ${order}
publishedAt: '${new Date().toISOString()}'
---

Menu updated via Menu Manager.
`

    let savedLocally = false
    try {
      const publicMenusDir = path.join(process.cwd(), 'public', 'menus')
      if (!fs.existsSync(publicMenusDir)) {
        fs.mkdirSync(publicMenusDir, { recursive: true })
      }
      fs.writeFileSync(path.join(publicMenusDir, sanitizedFileName), buffer)

      const outstaticMenusDir = path.join(process.cwd(), 'outstatic', 'content', 'menus')
      if (!fs.existsSync(outstaticMenusDir)) {
        fs.mkdirSync(outstaticMenusDir, { recursive: true })
      }
      fs.writeFileSync(path.join(outstaticMenusDir, `${slug}.md`), markdownContent, 'utf8')
      savedLocally = true
    } catch (fsErr) {
      console.log('Local filesystem write failed or read-only:', fsErr)
    }

    // If GitHub credentials are available in environment, commit to GitHub
    const githubToken = process.env.GITHUB_TOKEN || process.env.OST_GITHUB_TOKEN || process.env.OST_TOKEN
    const repoOwner = process.env.OST_REPO_OWNER || 'itsmyapp-code'
    const repoSlug = process.env.OST_REPO_SLUG || 'ship-inn-studio'
    const branch = process.env.OST_REPO_BRANCH || 'main'

    let githubCommitted = false
    if (githubToken) {
      try {
        const headers = {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Ship-Inn-Menu-Uploader'
        }

        // Helper to commit a file via GitHub REST API
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

        const pdfBase64 = buffer.toString('base64')
        const mdBase64 = Buffer.from(markdownContent, 'utf8').toString('base64')

        const fileOk = await commitGitHubFile(`public/menus/${sanitizedFileName}`, pdfBase64, `chore(menus): upload ${sanitizedFileName}`)
        const mdOk = await commitGitHubFile(`outstatic/content/menus/${slug}.md`, mdBase64, `feat(menus): update ${title}`)

        githubCommitted = fileOk && mdOk
      } catch (ghErr) {
        console.error('Error committing to GitHub:', ghErr)
      }
    }

    return NextResponse.json({
      success: true,
      fileName: sanitizedFileName,
      pdfPath,
      savedLocally,
      githubCommitted,
      message: 'Menu uploaded and updated successfully!'
    })
  } catch (error) {
    console.error('Error processing menu upload:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during upload'
    }, { status: 500 })
  }
}
