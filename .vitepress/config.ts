import { defineConfig } from 'vitepress'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

/**
 * Build-time macro: expand a terse ````apimethod` block into a real `### Name`
 * markdown heading (so VitePress's outline + search see it) followed by an
 * `<ApiMethod>` card. Params, returns and description are emitted as plain
 * MARKDOWN inside the card (searchable, and with no component props to escape).
 *
 * Params and returns are authored as **Lua table literals**, one per list item:
 *
 *   ````apimethod
 *   name: AceDB:New
 *   kind: method                 # optional, default "method"
 *   params:
 *     - { name = "tbl", type = "string|table", desc = "SavedVariables name, or a table to use." }
 *     - { name = "defaults", type = "table", default = "nil", desc = "Table of database defaults." }
 *     - { name = "defaultProfile", type = "string|boolean", optional = true, desc = "Starting profile name." }
 *   returns:
 *     - { type = "table", desc = "The new database object." }
 *   ---
 *   Markdown body (description, examples, even ```lua blocks).
 *   ````
 *
 * A param is optional when it has `optional = true` or a `default` (the value
 * it takes when omitted/nil); a param with neither is mandatory. There is no
 * `required` field. `returns:` may instead be a single inline Lua object
 * (`returns: { type = "table", desc = "the new database object." }`). The signature is
 * always generated from name + params (optionals get a `?` suffix, in declared
 * order; a param named `...` is varargs and a param named `a|b` is a union).
 * `---` splits header from body. Uses 4 backticks so the body may contain ```
 * fences.
 */

// Matches @mdit-vue/shared slugify (used by VitePress for heading ids).
function slugify(str: string): string {
  return str
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

// Markdown-table cell helpers.
const escCell = (s: string) => String(s).replace(/\|/g, '\\|')
const typeCell = (t?: string) =>
  t ? t.split('|').map((x) => '`' + x.trim() + '`').join(' ') : ''

// Parse a single Lua value: quoted string, boolean, number, or nil.
function parseLuaValue(v: string): any {
  v = v.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).replace(/\\(["'\\])/g, '$1')
  }
  if (v === 'true') return true
  if (v === 'false') return false
  if (v === 'nil') return undefined
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v
}

// Parse a flat Lua table literal `{ key = value, ... }` into an object.
// Quote-aware comma splitting; values via parseLuaValue.
function parseLuaTable(src: string): Record<string, any> {
  const obj: Record<string, any> = {}
  let s = src.trim().replace(/^{/, '').replace(/}$/, '')
  const parts: string[] = []
  let buf = '', q: string | null = null, esc = false
  for (const ch of s) {
    if (esc) { buf += ch; esc = false; continue }
    if (ch === '\\') { buf += ch; esc = true; continue }
    if (q) { buf += ch; if (ch === q) q = null; continue }
    if (ch === '"' || ch === "'") { q = ch; buf += ch; continue }
    if (ch === ',') { parts.push(buf); buf = ''; continue }
    buf += ch
  }
  if (buf.trim()) parts.push(buf)
  for (const part of parts) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const key = part.slice(0, eq).trim().replace(/^\[|]$/g, '').replace(/^["']|["']$/g, '')
    obj[key] = parseLuaValue(part.slice(eq + 1))
  }
  return obj
}

function expandApiMethods(src: string): string {
  return src.replace(/^````apimethod[ \t]*\n([\s\S]*?)\n````[ \t]*$/gm, (_m, block: string) => {
    let head = block
    let body = ''
    const sep = block.match(/^---[ \t]*$/m)
    if (sep && sep.index !== undefined) {
      head = block.slice(0, sep.index)
      body = block.slice(sep.index + sep[0].length).replace(/^\n/, '')
    }

    // An optional second `---` in the body splits off an example, which renders
    // last (after the parameter/return tables) under an "Example" label. Only
    // methods that actually warrant an example include this section; there is no
    // automatic guessing from the body.
    let example = ''
    const exSep = body.match(/^---[ \t]*$/m)
    if (exSep && exSep.index !== undefined) {
      example = body.slice(exSep.index + exSep[0].length).replace(/^\n/, '').trim()
      body = body.slice(0, exSep.index)
    }

    type Param = { name: string; type: string; desc: string; optional: boolean; default?: any }
    type Ret = { name?: string; type: string; desc: string }

    const fields: Record<string, string> = {}
    const params: Param[] = []
    const returns: Ret[] = []
    let mode: 'none' | 'params' | 'returns' = 'none'
    for (const raw of head.split('\n')) {
      const line = raw.replace(/\s+$/, '')
      if (!line.trim()) continue
      if (/^params:\s*$/.test(line)) { mode = 'params'; continue }
      if (/^returns:\s*$/.test(line)) { mode = 'returns'; continue }
      if (mode !== 'none' && /^\s*-\s+/.test(line)) {
        const t = parseLuaTable(line.replace(/^\s*-\s+/, ''))
        if (mode === 'params') {
          // No `required` field: a param is optional if flagged optional or it
          // has a default (a default is the value used when omitted/nil);
          // otherwise it is mandatory.
          const optional = t.optional === true || t.default !== undefined
          params.push({ name: t.name || '', type: t.type || '', desc: t.desc || '', optional, default: t.default })
        } else {
          returns.push({ name: t.name, type: t.type || '', desc: t.desc || '' })
        }
        continue
      }
      mode = 'none'
      const idx = line.indexOf(':')
      if (idx === -1) continue
      fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
    }

    // Heading/outline shows the bare method name (the page is already the
    // module), e.g. "AceComm:SendCommMessage" → "SendCommMessage". The full
    // signature still appears in the card. `title:` overrides if needed.
    const title = fields.title || (fields.name || '').replace(/^.*[:.]/, '')
    const slug = slugify(title)

    // Generate the signature from name + params, in declared order: optional
    // params get a `?` suffix (varargs `...` is left as-is). This preserves
    // real argument order, including a leading optional before a required one.
    const args = params.map((p) => (p.name === '...' ? '...' : p.name + (p.optional ? '?' : ''))).join(', ')
    const sig = `${fields.name}(${args})`

    const out: string[] = [
      `### ${title}`,
      '',
      `<ApiMethod kind="${fields.kind || 'method'}" anchor="${slug}">`,
      '',
      '```lua',
      sig,
      '```',
    ]
    if (body.trim()) out.push('', body.trim())

    if (params.length) {
      out.push('', '**Parameters**', '', '| Parameter | Type | Default | Description |', '| --- | --- | --- | --- |')
      for (const p of params) {
        const name = '`' + p.name + '`' + (p.optional ? ' *(optional)*' : '')
        const def = p.default !== undefined ? '`' + escCell(p.default) + '`' : ''
        out.push(`| ${name} | ${typeCell(p.type)} | ${def} | ${escCell(p.desc)} |`)
      }
    }

    // Returns always render as a Type | Description table for consistency,
    // whether a single value or several. A named return bolds its name.
    const retRows = returns.map((r) => ({
      type: r.type,
      desc: r.name ? `**${r.name}**: ${r.desc}` : r.desc,
    }))
    // A single inline return is authored as a Lua object, e.g.
    // `returns: { type = "table", desc = "the new database object." }`.
    // A bare string with no braces is treated as a description with no type.
    if (!retRows.length && fields.returns) {
      const r = fields.returns.trim().startsWith('{')
        ? parseLuaTable(fields.returns)
        : { type: '', desc: fields.returns }
      retRows.push({ type: r.type || '', desc: r.desc ?? fields.returns })
    }
    if (retRows.length) {
      out.push('', '**Returns**', '', '| Type | Description |', '| --- | --- |')
      for (const r of retRows) out.push(`| ${typeCell(r.type)} | ${escCell(r.desc)} |`)
    }

    // Example renders last, after the tables, under a bold label that matches
    // the **Parameters** / **Returns** labels above it.
    if (example) out.push('', '**Example**', '', example)

    out.push('', '</ApiMethod>')
    return out.join('\n')
  })
}

// Deployed site URL, used for the sitemap, canonical links and social-card
// (Open Graph) tags.
const SITE_URL = 'https://wowace-docs.nickdnk.workers.dev'

// https://vitepress.dev/reference/site-config
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  lang: 'en-US',
  title: 'Ace3',
  // Sub-page <title> read e.g. "AceDB-3.0 | Ace3 Documentation"; the home page
  // overrides this with its own keyword-rich title (see index.md frontmatter).
  titleTemplate: ':title | Ace3 Documentation',
  description: 'Documentation for the Ace3 World of Warcraft addon framework',
  // Anchor-scroll offset. The default is a fixed 134px, far below the 64px nav,
  // which left a big gap above a clicked entry. Measure the real nav height and
  // add a small breathing-room padding instead.
  scrollOffset: { selector: ['header.VPNav', '.VPLocalNav'], padding: 16 },
  lastUpdated: true,
  cleanUrls: true,
  // Don't build these into the site: the old reference dump, the Ace3 submodule
  // source, and repo docs that aren't site pages.
  srcExclude: ['legacy_docs/**', 'Ace3/**', 'README.md', 'CLAUDE.md'],
  appearance: 'dark',
  sitemap: { hostname: SITE_URL },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    // Brand blue, colours the mobile browser chrome / address bar.
    ['meta', { name: 'theme-color', content: '#4a90d9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Ace3 Documentation' }],
    ['meta', { property: 'og:image', content: `${SITE_URL}/logo.png` }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    // Site-wide structured data so search engines understand the site identity.
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ace3 Documentation',
        url: SITE_URL,
        description: 'Documentation for the Ace3 World of Warcraft addon framework.',
        inLanguage: 'en-US',
      }),
    ],
  ],

  // Per-page Open Graph / Twitter title + description, canonical URL, og:url,
  // and per-page structured data.
  transformPageData(pageData) {
    const title = pageData.title ? `${pageData.title} | Ace3 Documentation` : 'Ace3 Documentation'
    const description =
      pageData.description ||
      'Documentation for the Ace3 World of Warcraft addon framework.'
    // Build the clean, canonical URL for this page (matches `cleanUrls: true`).
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')
    const canonical = `${SITE_URL}/${path}`
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: canonical }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    )
    // TechArticle structured data for content pages (the home page is the WebSite).
    if (path) {
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: pageData.title || 'Ace3 Documentation',
          description,
          url: canonical,
          inLanguage: 'en-US',
          isPartOf: { '@type': 'WebSite', name: 'Ace3 Documentation', url: SITE_URL },
        }),
      ])
    }
  },

  // Emit /llms.txt at build: a flat, link-first index of the docs for LLM/AI
  // tools, generated from the sidebar so it stays in sync with the page set.
  buildEnd(siteConfig) {
    const sidebar = (siteConfig.site.themeConfig as any)?.sidebar || []
    const lines = [
      '# Ace3 Documentation',
      '',
      '> Documentation for the Ace3 World of Warcraft addon framework: a suite of embeddable Lua libraries for addon structure, saved variables, configuration, events, timers, communication, serialization, localization, and GUI.',
      '',
      `> Full content (all pages concatenated): ${SITE_URL}/llms-full.txt`,
      '',
    ]
    const collect = (items: any[], out: string[]) => {
      for (const it of items || []) {
        if (typeof it.link === 'string' && it.link.startsWith('/')) {
          out.push(`- [${it.text}](${SITE_URL}${it.link})`)
        }
        if (it.items) collect(it.items, out)
      }
    }
    for (const group of sidebar) {
      const out: string[] = []
      collect(group.items, out)
      if (out.length) lines.push(`## ${group.text}`, '', ...out, '')
    }
    writeFileSync(join(siteConfig.outDir, 'llms.txt'), lines.join('\n'))

    // Emit /llms-full.txt: full markdown content of every page for AI tools
    // that can consume a single-file reference instead of crawling.
    const fullLines: string[] = [
      '# Ace3 Documentation — Full Reference',
      '',
      '> Documentation for the Ace3 World of Warcraft addon framework: a suite of embeddable Lua libraries for addon structure, saved variables, configuration, events, timers, communication, serialization, localization, and GUI.',
      '',
    ]
    const addPage = (link: string, title: string) => {
      const file = join(siteConfig.srcDir, link.replace(/^\//, '') + '.md')
      if (!existsSync(file)) return
      const content = readFileSync(file, 'utf-8').replace(/^---[\s\S]*?---\n*/, '').trim()
      fullLines.push('---', `# ${title}`, `URL: ${SITE_URL}${link}`, '', content, '')
    }
    addPage('/getting-started', 'Getting Started')
    addPage('/common-tasks', 'Common Tasks')
    const collectFull = (items: any[]) => {
      for (const it of items || []) {
        if (typeof it.link === 'string' && it.link.startsWith('/')) addPage(it.link, it.text)
        if (it.items) collectFull(it.items)
      }
    }
    for (const group of sidebar) collectFull(group.items)
    writeFileSync(join(siteConfig.outDir, 'llms-full.txt'), fullLines.join('\n'))
  },

  markdown: {
    theme: { light: 'github-light', dark: 'one-dark-pro' },
    // WoW .toc files aren't a Shiki language; render them as ini
    // (highlights the `##` directive lines as comments) to avoid the
    // "language 'toc' is not loaded" fallback warning.
    languageAlias: {
      toc: 'ini',
    },
    config(md) {
      // Expand ````apimethod` blocks before parsing so the generated `### Name`
      // headings feed VitePress's outline/search like any other heading.
      md.core.ruler.before('normalize', 'apimethod_expand', (state) => {
        state.src = expandApiMethods(state.src)
      })
      // Language/filename icons on code blocks and code-group tabs.
      md.use(groupIconMdPlugin)
    },
  },

  vite: {
    plugins: [groupIconVitePlugin()],
  },

  themeConfig: {
    logo: '/logo.png',
    outline: { level: [2, 3], label: 'On this page' },
    editLink: {
      pattern: 'https://github.com/nickdnk/wowace-docs/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: { text: 'Last updated' },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Download', link: 'https://www.wowace.com/projects/ace3/files/latest' },
      {
        text: 'GitHub',
        items: [
          { text: 'Documentation source', link: 'https://github.com/nickdnk/wowace-docs' },
          { text: 'Ace3 library source', link: 'https://github.com/WoWUIDev/Ace3' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    // A single shared sidebar: Ace3 is the framework, every library
    // (AceGUI-3.0 included) is just one component among the others.
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Common Tasks', link: '/common-tasks' },
        ],
      },
      {
        text: 'Addon Structure',
        items: [
          { text: 'AceAddon-3.0', link: '/api/ace-addon' },
          { text: 'AceConsole-3.0', link: '/api/ace-console' },
          { text: 'AceEvent-3.0', link: '/api/ace-event' },
          { text: 'AceBucket-3.0', link: '/api/ace-bucket' },
          { text: 'AceHook-3.0', link: '/api/ace-hook' },
          { text: 'AceTimer-3.0', link: '/api/ace-timer' },
        ],
      },
      {
        text: 'Persisting Data',
        items: [
          { text: 'AceDB-3.0', link: '/api/ace-db' },
          { text: 'AceDBOptions-3.0', link: '/api/ace-db-options' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'AceConfig-3.0', link: '/api/ace-config' },
          { text: 'AceConfigCmd-3.0', link: '/api/ace-config-cmd' },
          { text: 'AceConfigDialog-3.0', link: '/api/ace-config-dialog' },
          { text: 'AceConfigRegistry-3.0', link: '/api/ace-config-registry' },
          { text: 'Options Tables', link: '/api/ace-config-options' },
        ],
      },
      {
        text: 'Communication & Data',
        items: [
          { text: 'AceComm-3.0', link: '/api/ace-comm' },
          { text: 'AceSerializer-3.0', link: '/api/ace-serializer' },
          { text: 'AceLocale-3.0', link: '/api/ace-locale' },
          { text: 'AceTab-3.0', link: '/api/ace-tab' },
          { text: 'CallbackHandler-1.0', link: '/api/callback-handler' },
        ],
      },
      {
        text: 'Design & Presentation',
        items: [
          { text: 'AceGUI-3.0', link: '/acegui/' },
          { text: 'Common Widget API', link: '/acegui/widget-api' },
          {
            text: 'Widgets',
            collapsed: true,
            items: [
              { text: 'Button', link: '/acegui/widgets/button' },
              { text: 'CheckBox', link: '/acegui/widgets/checkbox' },
              { text: 'ColorPicker', link: '/acegui/widgets/colorpicker' },
              { text: 'Dropdown', link: '/acegui/widgets/dropdown' },
              { text: 'EditBox', link: '/acegui/widgets/editbox' },
              { text: 'Heading', link: '/acegui/widgets/heading' },
              { text: 'Icon', link: '/acegui/widgets/icon' },
              { text: 'InteractiveLabel', link: '/acegui/widgets/interactivelabel' },
              { text: 'Keybinding', link: '/acegui/widgets/keybinding' },
              { text: 'Label', link: '/acegui/widgets/label' },
              { text: 'MultiLineEditBox', link: '/acegui/widgets/multilineeditbox' },
              { text: 'Slider', link: '/acegui/widgets/slider' },
            ],
          },
          {
            text: 'Containers',
            collapsed: true,
            items: [
              { text: 'Frame', link: '/acegui/containers/frame' },
              { text: 'Window', link: '/acegui/containers/window' },
              { text: 'SimpleGroup', link: '/acegui/containers/simplegroup' },
              { text: 'InlineGroup', link: '/acegui/containers/inlinegroup' },
              { text: 'ScrollFrame', link: '/acegui/containers/scrollframe' },
              { text: 'TabGroup', link: '/acegui/containers/tabgroup' },
              { text: 'TreeGroup', link: '/acegui/containers/treegroup' },
              { text: 'DropDownGroup', link: '/acegui/containers/dropdowngroup' },
              { text: 'BlizOptionsGroup', link: '/acegui/containers/blizoptionsgroup' },
            ],
          },
        ],
      },
    ],

    footer: {
      message: 'Ace3, a World of Warcraft addon framework.',
    },
  },
})
