/**
 * Vite plugin for dev-server port discovery via WebSocket.
 * Extracted from chagee's vite-plugin-serve-ports-ws.
 *
 * Each segment dev server registers its port with a central WS service,
 * so the Shell can auto-discover locally running segments.
 */

import type { Plugin } from 'vite'

const WS_PORT = 8356

/**
 * Creates a Vite plugin that broadcasts this dev server's port
 * to the Pavilion WS discovery service on start.
 */
export function wsDiscoveryPlugin(options: {
  port?: number
  name?: string
} = {}): Plugin {
  let serverPort: number | undefined = options.port
  let wsClient: WebSocket | null = null

  function connectWsServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${WS_PORT}`)
      wsClient = ws

      ws.onopen = () => {
        console.log(`[Pavilion] Connected to dev discovery service`)
        resolve()
      }

      ws.onerror = (err) => {
        // WS may not be running in standalone mode — that's fine
        console.debug('[Pavilion] Dev discovery service not available')
        reject(err)
      }
    })
  }

  function broadcastPort(action: 'add' | 'remove'): void {
    if (wsClient && wsClient.readyState === WebSocket.OPEN && serverPort) {
      wsClient.send(
        JSON.stringify({ action, port: serverPort, name: options.name })
      )
    }
  }

  return {
    name: 'pavilion:ws-discovery',

    async configureServer(server) {
      const resolvedPort = server.config.server.port ?? 5173
      if (!serverPort) serverPort = resolvedPort
      if (!options.name) options.name = `segment-${resolvedPort}`

      server.httpServer?.once('listening', async () => {
        try {
          await connectWsServer()
          broadcastPort('add')
        } catch {
          // WS discovery not available — dev standalone
        }
      })
    },

    closeBundle() {
      broadcastPort('remove')
      setTimeout(() => wsClient?.close(), 200)
    },
  }
}
