import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})

try {
  await server.ssrLoadModule('/src/selfCheck.ts')
} finally {
  await server.close()
}
