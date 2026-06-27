/**
 * PostCSS plugin: auto-prefix CSS selectors with appCode scope.
 *
 * Inspired by chagee's @chagee/vite-plugin-sandbox.
 *
 * Input:
 *   .card { color: red; }
 *   .container .title { font-size: 12px; }
 *   @keyframes fade { from { opacity: 0; } }
 *
 * Output (prefix = '.pavilion-dashboard'):
 *   .pavilion-dashboard .card { color: red; }
 *   .pavilion-dashboard .container .title { font-size: 12px; }
 *   @keyframes pavilion-dashboard-fade { from { opacity: 0; } }
 */

import type { Plugin, Rule, AtRule } from 'postcss'

export interface CssScopeOptions {
  /** CSS class prefix, e.g. 'pavilion-dashboard' */
  prefix: string
  /** Regex patterns for files that should NOT be scoped */
  exclude?: RegExp[]
  /** Regex patterns for files that SHOULD be scoped (if empty, scope all) */
  include?: RegExp[]
}

/**
 * Determine if a PostCSS node's source file matches any exclude/include pattern.
 * Returns false if the file should be scoped, true if it should be skipped.
 */
function shouldSkip(
  node: Rule | AtRule,
  exclude?: RegExp[],
  include?: RegExp[]
): boolean {
  const file = node.source?.input?.file
  if (!file) return false

  if (exclude?.some((re) => re.test(file))) return true
  if (include && include.length > 0 && !include.some((re) => re.test(file))) return true

  return false
}

/**
 * Prepend scope prefix to a single CSS selector.
 */
function scopeSelector(selector: string, prefix: string): string {
  const trimmed = selector.trim()

  // :root → .prefix directly
  if (trimmed === ':root' || trimmed === ':root(') {
    return `.${prefix}`
  }

  // ::before, ::after, etc. — pseudo-elements that can't be prefixed
  if (trimmed.startsWith('::')) {
    return `.${prefix} ${trimmed}`
  }

  // Already scoped — skip
  if (trimmed.startsWith(`.${prefix}`)) {
    return trimmed
  }

  // Special selectors that need wrapping, not prefixing
  if (trimmed.startsWith('@') || trimmed.startsWith(':') && !trimmed.startsWith(':where')) {
    return `.${prefix} ${trimmed}`
  }

  // Default: prepend .prefix with space combinator
  return `.${prefix} ${trimmed}`
}

export function cssScopePlugin(options: CssScopeOptions): Plugin {
  const { prefix, exclude, include } = options

  return {
    postcssPlugin: 'pavilion-css-scope',

    Rule(rule: Rule) {
      if (shouldSkip(rule, exclude, include)) return

      rule.selectors = rule.selectors.map((sel) => scopeSelector(sel, prefix))
    },

    AtRule(atRule: AtRule) {
      if (shouldSkip(atRule, exclude, include)) return

      // Prefix keyframe names
      if (
        atRule.name === 'keyframes' ||
        atRule.name === '-webkit-keyframes'
      ) {
        atRule.params = `${prefix}-${atRule.params}`
      }
    },
  }
}

cssScopePlugin.postcss = true
