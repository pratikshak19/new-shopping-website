import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const TYPES = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.zip': 'application/zip',
}

function docsHeaders(req, res, next) {
  const url = req.url?.split('?')[0] || ''
  const ext = Object.keys(TYPES).find((e) => url.endsWith(e))
  if (url.startsWith('/docs/') && ext) {
    const name = url.split('/').pop()
    res.setHeader('Content-Type', TYPES[ext])
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
  }
  next()
}

function docsDownload() {
  return {
    name: 'docs-download-headers',
    configureServer(server) {
      server.middlewares.use(docsHeaders)
    },
    configurePreviewServer(server) {
      server.middlewares.use(docsHeaders)
    },
  }
}

export default defineConfig({
  plugins: [react(), docsDownload()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
