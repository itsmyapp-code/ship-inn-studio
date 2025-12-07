/*
  brand-clone.js
  Usage: node brand-clone.js "The Seale Arms" seale-arms seale-arms-website

  This script copies the current project folder (recursively) into a new folder
  and replaces branding strings in text files. It skips node_modules, .git, .next,
  .vercel and the destination folder if it already exists.
*/

const fs = require('fs')
const path = require('path')

if (process.argv.length < 5) {
  console.error('Usage: node brand-clone.js "Display Name" slug destFolder')
  process.exit(1)
}

const DISPLAY_NAME = process.argv[2] // e.g. "The Seale Arms"
const SLUG = process.argv[3] // e.g. seale-arms
const DEST = process.argv[4] // e.g. seale-arms-website

const ROOT = process.cwd()
const IGNORES = new Set(['node_modules', '.git', '.next', '.vercel', DEST])

// mapping: old -> new (case sensitive) and some common variants
const REPLACEMENTS = [
  { from: 'The Ship Inn Porlock Weir', to: DISPLAY_NAME },
  { from: 'The Ship Inn', to: DISPLAY_NAME },
  { from: 'Ship Inn', to: DISPLAY_NAME },
  { from: 'ship-inn', to: SLUG },
  { from: 'Ship-Inn', to: SLUG },
  { from: 'shipinn', to: SLUG.replace(/-/g, '') },
  { from: 'shipinnporlockweir', to: SLUG.replace(/-/g, '') },
  { from: 'porlock weir', to: '' }, // leave local addresses for manual change
]

const TEXT_FILE_EXTS = new Set(['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.html', '.css', '.scss', '.csv', '.yml', '.yaml', '.env'])

function isBinary(filePath) {
  const binExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.svg']
  return binExts.includes(path.extname(filePath).toLowerCase())
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copyAndReplace(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    ensureDirSync(dest)
    const items = fs.readdirSync(src)
    for (const item of items) {
      if (IGNORES.has(item)) continue
      const s = path.join(src, item)
      const d = path.join(dest, item)
      copyAndReplace(s, d)
    }
  } else if (stat.isFile()) {
    // Binary files: copy as-is
    if (isBinary(src)) {
      fs.copyFileSync(src, dest)
      return
    }

    // Text file: read, replace strings, write
    let content = fs.readFileSync(src, 'utf8')

    REPLACEMENTS.forEach(r => {
      const re = new RegExp(escapeRegExp(r.from), 'g')
      content = content.replace(re, r.to)
    })

    fs.writeFileSync(dest, content, 'utf8')
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Start cloning
const srcRoot = ROOT
const destRoot = path.join(path.dirname(ROOT), DEST)
if (fs.existsSync(destRoot)) {
  console.error('Destination already exists:', destRoot)
  console.error('Remove it first or choose a different dest folder.')
  process.exit(1)
}

console.log('Cloning project:')
console.log('  from:', srcRoot)
console.log('  to:  ', destRoot)
console.log('\nReplacing branding:')
REPLACEMENTS.forEach(r => console.log(`  ${r.from}  →  ${r.to}`))

copyAndReplace(srcRoot, destRoot)

// Post-processing: rename any files or folders that include 'ship-inn' in their name
function renamePaths(root) {
  const q = [root]
  while (q.length) {
    const dir = q.shift()
    const items = fs.readdirSync(dir)
    for (const item of items) {
      const oldPath = path.join(dir, item)
      let newName = item
      if (newName.includes('ship-inn')) newName = newName.replace(/ship-inn/g, SLUG)
      if (newName.includes('Ship-Inn')) newName = newName.replace(/Ship-Inn/g, SLUG)
      if (newName !== item) {
        const newPath = path.join(dir, newName)
        fs.renameSync(oldPath, newPath)
        // if renamed directory, push to queue newPath
        const s = fs.statSync(newPath)
        if (s.isDirectory()) q.push(newPath)
      } else {
        const s = fs.statSync(oldPath)
        if (s.isDirectory()) q.push(oldPath)
      }
    }
  }
}

try {
  renamePaths(destRoot)
} catch (err) {
  console.warn('Warning: renaming paths failed:', err.message)
}

console.log('\nClone complete. New project created at:', destRoot)
console.log('Next steps:')
console.log(`  1) cd ${DEST}`)
console.log('  2) npm install')
console.log('  3) npm run dev or npm run build')
console.log('\nNote: Please review the new project for address, contact details and images that may need manual updates.')
