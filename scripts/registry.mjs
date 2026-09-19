#!/usr/bin/env node
/**
 * registry · 从源码单一真相源生成「可精确复用」的两份产物
 *
 *   registry.json            机器可读：Agent 选型入口（契约 + 真实 props + 用法 + 源码）
 *   references/prompt-pack.md 人的复制粘贴包：每个组件一段可独立使用的提示词 + 配置代码
 *
 * 为什么要生成而不是手写：
 *   手写的第二份描述一定会与代码脱钩 —— 本次实测 components.md 有 18 处写了源码里
 *   根本不存在的属性（text / contacts / logo / pageNo / headerImage …），
 *   而 `npm run build` 完全查不出来，因为没人拿文档去跑。
 *   所以：**契约写在组件源码上方（@ds-contract），本脚本只做投影**；
 *   文档与 registry 的一致性由 `npm run audit` 反查。
 *
 * 用法：node scripts/registry.mjs        （npm run registry）
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, basename } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8').replace(/\r\n/g, '\n')

/* 非组件导出：与 audit.mjs 的 NON_COMPONENT 保持同一口径 */
const NON_COMPONENT = new Set([
  'THEMES', 'NEUTRAL', 'getTheme', 'ThemeProvider', 'useTheme', 'useNeutral', 'ICON_NAMES',
  'pastelRamp', 'toneRamp', 'categoryRamp', 'mixWhite', 'mixBlack', 'shiftHue',
  'hexToRgb', 'rgbToHex', 'rgbToHsl', 'hslToRgb', 'renderRich',
])

/* 必需的契约字段（audit 也查这 4 个） */
export const REQUIRED = ['intent', 'use', 'notfor', 'usage']
export const OPTIONAL = ['pairs', 'hue', 'evidence', 'since']

/* 族归属：index.js 里每个 `// —— 族 X 名称` 注释统领其后的 export 行。
   少数组件不在任何"族"注释下（Icon），用回退表补。 */
const FAMILY_FALLBACK = { Icon: 'G' }
const FAMILY_META = {
  A: '结构页', B: '标题族', C: '表格族', D: '卡片族', E: '流程族',
  F: '案例与证据族', G: '页面骨架与图标', H: '流程与图解族', I: '数据与证据族',
  J: '标签族', K: '文本族', M: '拓扑图族', N: '图解族', O: '页眉页脚',
}

/* ---------- 解析器 ---------- */

/** 拆顶层逗号（忽略括号/花括号内的逗号） */
function splitTop(s) {
  const out = []
  let depth = 0, cur = ''
  for (const ch of s) {
    if ('([{'.includes(ch)) depth++
    if (')]}'.includes(ch)) depth--
    if (ch === ',' && depth === 0) { out.push(cur); cur = '' } else cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out.map((x) => x.trim()).filter(Boolean)
}

/** 取 export function NAME( ... ) 的括号内容（跨行、按括号配平） */
function paramText(src, fromIdx) {
  let depth = 0, started = false, buf = ''
  for (let k = fromIdx; k < src.length; k++) {
    const ch = src[k]
    if (ch === '(') { depth++; started = true; if (depth === 1) continue }
    else if (ch === ')') { depth--; if (started && depth === 0) break }
    if (started && depth >= 1) buf += ch
  }
  return buf
}

/** 取函数体（到列 0 的 } 为止） */
function bodyText(src, fromIdx) {
  const i = src.indexOf('\n}', fromIdx)
  return i === -1 ? src.slice(fromIdx) : src.slice(fromIdx, i + 2)
}

/** 契约块：紧贴 export 上方的那一个 /* @ds-contract ... *\/ */
function contractOf(src, anchorIdx) {
  const above = src.slice(0, anchorIdx)
  const j = above.lastIndexOf('*/')
  if (j === -1 || above.slice(j + 2).trim() !== '') return null
  const k = above.lastIndexOf('/*', j)
  if (k === -1) return null
  const block = above.slice(k, j + 2)
  if (!block.includes('@ds-contract')) return null
  const out = {}
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*\*\s*([a-z]+):\s*(.*?)\s*$/)
    if (m && m[1] !== '@ds-contract') out[m[1]] = m[2]
  }
  return out
}

/* ---------- 构建 ---------- */

export function build() {
  const indexSrc = read('src/lib/index.js')
  const files = readdirSync(join(ROOT, 'src/lib')).filter((f) => f.endsWith('.jsx')).sort()

  /* 1) 名 → 族（从 index.js 的族注释解析） */
  const famOf = {}
  let cur = null
  for (const line of indexSrc.split('\n')) {
    const fm = line.match(/^\/\/\s*——\s*族\s*([A-O])\s*(.*)$/)
    if (fm) {
      cur = fm[1]
      let name = fm[2].split(/[：:（(]/)[0].trim()
      FAMILY_META[cur] = name || FAMILY_META[cur] || ''
      continue
    }
    const em = line.trim().match(/^export\s*\{([^}]*)\}\s*from/)
    if (!em) continue
    for (const raw of em[1].split(',')) {
      const n = raw.trim()
      if (n && !NON_COMPONENT.has(n)) famOf[n] = cur || FAMILY_FALLBACK[n] || null
    }
  }

  /* 2) 逐文件提取组件 */
  const components = []
  const issues = []
  for (const f of files) {
    const src = read(join('src/lib', f))
    const re = /^export function (\w+)\s*\(/gm
    let m
    while ((m = re.exec(src))) {
      const name = m[1]
      if (NON_COMPONENT.has(name)) continue
      const at = m.index
      const params = paramText(src, at).replace(/\s+/g, ' ').trim()
      // 解构外层花括号后再按顶层逗号拆，否则会把 "{ items" 当成一个属性名
      const inner = params.replace(/^\{/, '').replace(/\}$/, '')
      const props = splitTop(inner).map((p) => {
        const eq = p.indexOf('=')
        if (eq === -1) return { name: p.split(':')[0].trim(), default: null }
        return { name: p.slice(0, eq).split(':')[0].trim(), default: p.slice(eq + 1).trim() }
      })
      const c = contractOf(src, at) || {}
      const fam = famOf[name]
      if (!fam) issues.push(`${name}：解析不到所属族（index.js 缺"族 X"注释 或 需补 FAMILY_FALLBACK）`)
      for (const k of REQUIRED) if (!c[k]) issues.push(`${name}：契约缺必需字段 ${k}`)

      const usage = c.usage || `<${name} />`
      const prompt = [
        `用本设计系统的 ${name}（族 ${fam || '?'} ${FAMILY_META[fam] || ''}）实现该区块。`,
        ``,
        `语义：${c.intent || '（未标注）'}`,
        `何时用：${c.use || '（未标注）'}`,
        `何时不用：${c.notfor || '（未标注）'}${c.pairs ? `\n配套：${c.pairs}` : ''}`,
        `来源配色：${c.hue || '随主题'}`,
        ``,
        `硬约束：`,
        `· 配色取自**来源手册色相或调用页主题**，不得把配色统一成蓝色（R23）；`,
        `· 不得在页面里写死 hex，一律从主题令牌派生（R4）；`,
        `· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；`,
        `· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；`,
        `· 只允许用组件白名单里的组件，禁止自创一次性样式。`,
        ``,
        `用法：`,
        usage,
      ].join('\n')

      components.push({
        name,
        family: fam,
        familyName: FAMILY_META[fam] || '',
        file: `src/lib/${f}`,
        since: c.since || '—',
        import: `import { ${name} } from './src/lib'`,
        signature: params,
        props,
        contract: {
          intent: c.intent || '',
          use: c.use || '',
          notfor: c.notfor || '',
          pairs: c.pairs || '',
          hue: c.hue || '',
          evidence: c.evidence || '',
        },
        usage,
        prompt,
        source: bodyText(src, at),
      })
    }
  }

  components.sort((a, b) => (a.family + a.name).localeCompare(b.family + b.name))

  /* 3) 族汇总 */
  const fams = {}
  for (const c of components) {
    if (!c.family) continue
    fams[c.family] = fams[c.family] || { letter: c.family, name: c.familyName, components: [] }
    fams[c.family].components.push(c.name)
  }
  const families = Object.values(fams).sort((a, b) => a.letter.localeCompare(b.letter))

  /* 4) 规则数（从 rules.md 数回来，避免硬编码） */
  const rulesRaw = read('references/rules.md')
  const ruleIds = [...rulesRaw.matchAll(/\*\*R(\d+)\*\*/g)].map((x) => Number(x[1]))
  const rules = ruleIds.length ? Math.max(...ruleIds) : 0

  const version = JSON.parse(read('package.json')).version

  const json = {
    name: 'yuxiaomo-design-system',
    version,
    generatedBy: 'scripts/registry.mjs',
    note: '契约唯一真相源是 src/lib/*.jsx 里的 /* @ds-contract */；本文件是它的投影，请勿手改。',
    counts: { components: components.length, families: families.length, rules },
    families,
    components,
  }

  /* ---------- prompt-pack.md ---------- */
  const L = []
  L.push(`# 提示词包 · Prompt Pack（${components.length} 个组件 / ${families.length} 族）`)
  L.push('')
  L.push('> **本文件由 `scripts/registry.mjs` 从组件源码生成，不要手改。**')
  L.push('> 契约的唯一真相源是 `src/lib/*.jsx` 里紧贴组件上方的 `/* @ds-contract */` 块。')
  L.push('> 复制每节的「提示词」直接给模型即可；「配置代码」是可运行的 JSX 用法。')
  L.push('')
  L.push('## 系统级约束（每个提示词都已自带，此处便于通读）')
  L.push('')
  L.push('| # | 约束 | 内容 |')
  L.push('|---|---|---|')
  L.push('| R1 | 一册一色相 | 一份手册只有一个品牌色相，副色仅用于图表橙 |')
  L.push('| R4 | 组件不写死色 | 颜色一律从主题令牌派生，禁止页面里出现 hex |')
  L.push('| R14 | 一站一拓扑 | 同一语义全册只用一种拓扑；不同语义绝不共用 |')
  L.push('| R16 | 两种表格语体不混 | 营销参数表 `SpecTable` ↔ 技术数据表 `InstrumentReportPanel` |')
  L.push('| R22 | 类目色纪律 | 多档配色默认同色相（`tone`）；跨色相须显式且全册锁定 |')
  L.push('| **R23** | **配色随来源，不随默认** | **组件保持其来源手册的色相（见每节「来源配色」）；不得把所有组件统一成蓝色** |')
  L.push('')
  L.push('---')
  L.push('')

  for (const fam of families) {
    const list = components.filter((c) => c.family === fam.letter)
    L.push(`## 族 ${fam.letter} · ${fam.name}（${list.length} 个）`)
    L.push('')
    for (const c of list) {
      L.push(`### \`${c.name}\` · ${c.since}`)
      L.push('')
      L.push(`| | |`)
      L.push(`|---|---|`)
      L.push(`| 语义 | ${c.contract.intent} |`)
      L.push(`| 何时用 | ${c.contract.use} |`)
      L.push(`| 何时不用 | ${c.contract.notfor} |`)
      if (c.contract.pairs) L.push(`| 配套 | ${c.contract.pairs} |`)
      L.push(`| **来源配色** | **${c.contract.hue || '随主题'}** |`)
      if (c.contract.evidence) L.push(`| 来源证据 | ${c.contract.evidence} |`)
      L.push('')
      L.push('**提示词**（直接复制）')
      L.push('')
      L.push('```text')
      L.push(c.prompt)
      L.push('```')
      L.push('')
      L.push('**配置代码**')
      L.push('')
      L.push('```jsx')
      L.push(`${c.import}`)
      L.push('')
      L.push(c.usage)
      L.push('```')
      L.push('')
      L.push(`<details><summary>组件源码（${basename(c.file)} · ${c.source.split('\n').length} 行）</summary>`)
      L.push('')
      L.push('```jsx')
      L.push(c.source.trim())
      L.push('```')
      L.push('')
      L.push('</details>')
      L.push('')
    }
    L.push('---')
    L.push('')
  }

  return {
    json,
    jsonText: JSON.stringify(json, null, 2) + '\n',
    md: L.join('\n'),
    issues,
    stats: { components: components.length, families: families.length, rules },
  }
}

/* ---------- 写入 ---------- */

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const { jsonText, md, issues, stats } = build()
  writeFileSync(join(ROOT, 'registry.json'), jsonText)
  writeFileSync(join(ROOT, 'references/prompt-pack.md'), md)
  console.log('\n──────────────────────────────────────────────────────────')
  console.log('  registry 生成完成')
  console.log('──────────────────────────────────────────────────────────')
  // 注意用 Buffer.byteLength 而不是 .length —— 本库是 CJK 密集文件，一个中文字符
  // UTF-8 占 3 字节，用 .length（UTF-16 码元数）会把体积少报 25%–40%。
  // 报错的数字比不报更糟：它会被当成事实抄进文档。
  const kb = (s) => (Buffer.byteLength(s, 'utf8') / 1024).toFixed(1)
  console.log(`  ✓ registry.json               ${kb(jsonText)} KB`)
  console.log(`  ✓ references/prompt-pack.md   ${kb(md)} KB`)
  console.log(`  ✓ ${stats.components} 个组件 / ${stats.families} 族 / ${stats.rules} 条规则`)
  if (issues.length) {
    console.log(`  ! ${issues.length} 条问题：`)
    for (const i of issues) console.log('     · ' + i)
  } else console.log('  ✓ 契约完整（必需字段齐全、族归属全部解析成功）')
  console.log('──────────────────────────────────────────────────────────\n')
}
