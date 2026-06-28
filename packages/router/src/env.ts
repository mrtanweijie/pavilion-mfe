/**
 * PavilionMfe environment detection.
 *
 * The Shell's PavilionMfe router sets `window.__PAVILION_MFE_ENV__ = true` when
 * `start()` is called — before any segment app is loaded. Segment apps
 * can use `isPavilionMfeShell()` to detect whether they are running inside
 * the Shell (micro-frontend mode) or standalone.
 *
 * @example
 * import { isPavilionMfeShell } from '@pavilion-mfe/router'
 *
 * if (isPavilionMfeShell()) {
 *   // Running inside the PavilionMfe Shell
 * } else {
 *   // Running standalone
 * }
 */

declare global {
  interface Window {
    __PAVILION_MFE_ENV__?: boolean
  }
}

/**
 * Check if running inside a PavilionMfe Shell (micro-frontend environment).
 *
 * The global `window.__PAVILION_MFE_ENV__` is injected by the Shell's
 * PavilionMfe router during `start()`, before segments are loaded.
 */
export function isPavilionMfeShell(): boolean {
  return typeof window !== 'undefined' && !!window.__PAVILION_MFE_ENV__
}
