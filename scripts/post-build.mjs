import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const esDir = resolve('es')
const libDir = resolve('lib')

function ensureDir(dir) {
  if (!existsSync(dir))
    mkdirSync(dir, { recursive: true })
}

// Ensure output directories exist
ensureDir(esDir)
ensureDir(libDir)

console.log('Post-build: Output directories ready')
