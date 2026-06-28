/**
 * Pavilion environment detection.
 *
 * The Shell's Pavilion router sets `window.__PAVILION_MFE_ENV__ = true` when
 * `start()` is called — before any segment app is loaded. Segment apps
 * can use `isPavilionShell()` to detect whether they are running inside
 * the Shell (micro-frontend mode) or standalone.
 *
 * @example
 * import { isPavilionShell } from '@pavilion/router'
 *
 * if (isPavilionShell()) {
 *   // Running inside the Pavilion Shell
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
 * Check if running inside a Pavilion Shell (micro-frontend environment).
 *
 * The global `window.__PAVILION_MFE_ENV__` is injected by the Shell's
 * Pavilion router during `start()`, before segments are loaded.
 */
export function isPavilionShell(): boolean {
  return typeof window !== 'undefined' && !!window.__PAVILION_MFE_ENV__
}
