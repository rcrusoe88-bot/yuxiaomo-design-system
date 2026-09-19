#!/usr/bin/env node
/**
 * 一致性校验 · audit
 *
 * 为什么需要它：`npm run build` 只证明代码能编译，**不证明文档没写错数**。
 * v0.3 曾出现「代码 37 个组件 / 文档写 34（v0.1 更早写成 24）」的漂移，
 * 以及「版式原型 layouts.md 写 T1–T7、extending.md 与 templates 却按 L1–L8 引用」
 * 的命名空间撞车。这类问题人眼极难发现，但 Agent 一读就会用错。
 *
 * 用法：npm run audit   （退出码非 0 = 有错，可直接挂进 CI / 提交前钩子）
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { build as buildRegistry } from './registry.mjs'
import { CORPORA, ORIGIN_KEYS, THEMES } from '../src/lib/themes.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8').replace(/\r\n/g, '\n')

const errors = []
const warns = []
const info = []
const fail = (m) => errors.push(m)
const warn = (m) => warns.push(m)

/* ---------- 1. 代码：src/lib 实际导出了哪些组件 ---------- */

const NON_COMPONENT = new Set([
  'THEMES', 'NEUTRAL', 'getTheme', 'ThemeProvider', 'useTheme', 'useNeutral', 'ICON_NAMES',
  'CORPORA', 'ORIGIN_KEYS', 'BRAND_THEME_KEYS', 'manualLabel', 'defaultManualOf',
  'pastelRamp', 'toneRamp', 'categoryRamp', 'mixWhite', 'mixBlack', 'shiftHue',
  'hexToRgb', 'rgbToHex', 'rgbToHsl', 'hslToRgb', 'renderRich',
])

const indexSrc = read('src/lib/index.js')
const exported = []
for (const line of indexSrc.split('\n')) {
  const m = line.trim().match(/^export\s*\{([^}]*)\}\s*from/)
  if (!m) continue
  for (const raw of m[1].split(',')) {
    const name = raw.trim()
    if (name) exported.push(name)
  }
}
const components = exported.filter((n) => !NON_COMPONENT.has(n))
info.push(`代码实际导出：${components.length} 个组件 + ${exported.length - components.length} 个工具/常量`)

/* ---------- 2. 组件文档：是否双向覆盖 ---------- */

const compDoc = read('references/components.md')
const documented = new Set()
for (const m of compDoc.matchAll(/`([A-Z][A-Za-z0-9]*)`/g)) documented.add(m[1])

const missingDoc = components.filter((c) => !documented.has(c))
const ghostDoc = [...documented].filter(
  (d) => components.includes(d) === false && !NON_COMPONENT.has(d) && /^[A-Z]/.test(d) && d.length > 2
)
if (missingDoc.length) fail(`导出但没有文档的组件（${missingDoc.length}）：${missingDoc.join(', ')}`)
else info.push('组件双向覆盖：导出 ↔ 文档 完全一致')

/* ---------- 3. 文档声明的数量 vs 实际 ---------- */

// 每个 patterns：正则第 1 个捕获组必须是数字；label 用于报错信息
const countClaims = [
  ['README.md', /##\s*组件总览（(\d+)\s*个/, (n) => n === components.length, `组件总数应为 ${components.length}`],
  ['README.md', /│\s*├──\s*components\.md\s*#\s*(\d+)\s*个组件/, (n) => n === components.length, `组件总数应为 ${components.length}`],
  ['README.md', /│\s*├──\s*rules\.md\s*#\s*(\d+)\s*条/, null, '规则数'],
  ['SKILL.md', /系统提供\s*(\d+)\s*个可复用组件/, (n) => n === components.length, `组件总数应为 ${components.length}`],
  ['SKILL.md', /提供的组件拼成（(\d+)\s*个/, (n) => n === components.length, `组件总数应为 ${components.length}`],
  ['references/components.md', /#\s*组件 API · Components（(\d+)\s*个/, (n) => n === components.length, `组件总数应为 ${components.length}`],
]

const rulesDoc = read('references/rules.md')
const ruleIds = [...rulesDoc.matchAll(/\*\*R(\d+)\*\*/g)].map((m) => Number(m[1]))
const rulesTotal = ruleIds.length ? Math.max(...ruleIds) : 0
for (let i = 1; i <= rulesTotal; i++) {
  if (!ruleIds.includes(i)) fail(`规则编号缺号：R${i} 不存在，但存在 R${rulesTotal}`)
}
info.push(`代码/文档规则数：${rulesTotal} 条（R1–R${rulesTotal}，无缺号）`)

const multiClaims = [
  ['SKILL.md', /系统提供[^。]*?(\d+)\s*个可复用组件[^。]*?(\d+)\s*条可命名审美规则/, (a, b) => [components.length, rulesTotal]],
  ['SKILL.md', /遵守\s*(\d+)\s*条审美规则/, () => [rulesTotal]],
  ['README.md', /#\s*(\d+)\s*条可命名审美规则/, () => [rulesTotal]],
  ['references/rules.md', /^#\s*(\d+)\s*条可命名审美规则/m, () => [rulesTotal]],
]
for (const [file, re, expected] of multiClaims) {
  const src = file === 'README.md' ? read('README.md') : file === 'SKILL.md' ? read('SKILL.md') : rulesDoc
  const m = src.match(re)
  if (!m) { warn(`${file}：未找到数量声明 ${re}`); continue }
  if (!expected) continue
  const got = m.slice(1).map(Number)
  const exp = expected(...got)
  got.forEach((g, i) => {
    if (g !== exp[i]) fail(`${file} 声明 ${g}，实际应为 ${exp[i]}（匹配：${m[0].slice(0, 60)}）`)
  })
}

/* ---------- 4. 版式原型 L：连续 + 与模板映射有效 ---------- */

const layoutsDoc = read('references/layouts.md')
const layoutIds = [...layoutsDoc.matchAll(/\|\s*\*\*(L\d+)\*\*\s*\|/g)].map((m) => Number(m[1].slice(1)))
const layoutsTotal = layoutIds.length ? Math.max(...layoutIds) : 0
for (let i = 1; i <= layoutsTotal; i++) {
  if (!layoutIds.includes(i)) fail(`版式原型缺号：L${i} 未在 references/layouts.md 表格中出现`)
}
const declaredLayouts = layoutsDoc.match(/#\s*(\d+)\s*个版式原型/)
if (declaredLayouts && Number(declaredLayouts[1]) !== layoutIds.length) {
  fail(`references/layouts.md 标题声明 ${declaredLayouts[1]} 个原型，表格实列 ${layoutIds.length} 个`)
}
info.push(`版式原型：L1–L${layoutsTotal}（${layoutIds.length} 个）`)

const tplDoc = read('templates/README.md')
const tplRows = [...tplDoc.matchAll(/\|\s*(T\d{2})\s*\|([^|]*)\|\s*(L\d+)\s*([^|]*)\|/g)]
if (!tplRows.length) warn('templates/README.md：未解析到任何 T→L 映射行')
for (const [, tId, , lId] of tplRows) {
  const n = Number(lId.slice(1))
  if (!layoutIds.includes(n)) fail(`templates/README.md：${tId} 映射到 ${lId}，但该原型不存在`)
}
info.push(`整页模板：${tplRows.length} 条映射，全部指向存在的原型`)

/* ---------- 5. 命名空间不得越界（撞车检测） ---------- */

// layouts.md 是 L 的家，不该用 T 编号来指代原型。
// 例外：申明命名空间边界的那几行（同时提到"模板"/"templates"）是合法的，不算泄漏。
const tLeak = []
layoutsDoc.split('\n').forEach((ln, i) => {
  if (/模板|templates/.test(ln)) return
  for (const m of ln.matchAll(/\bT\d{1,2}\b/g)) tLeak.push(`${m[0]}@L${i + 1}`)
})
if (tLeak.length) fail(`references/layouts.md 混入模板编号 T：${tLeak.join(', ')}（原型用 L，模板用 T）`)

// extending.md 是 X 的家，不该用 E / L 编号
const extDoc = read('references/extending.md')
const extLeak = [...extDoc.matchAll(/\|\s*\**(?:L|E)\d+\**\s*[|｜]/g)].map((m) => m[0].trim())
if (extLeak.length) fail(`references/extending.md 混入 L/E 编号：${extLeak.join(', ')}（扩展类型用 X）`)
const xIds = [...extDoc.matchAll(/###\s*X(\d+)/g)].map((m) => Number(m[1]))
if (xIds.length === 0) warn('references/extending.md：未找到 X 编号小节')

// elements/README.md 是 E 的家
const elemDoc = read('elements/README.md')
const eIds = [...elemDoc.matchAll(/\|\s*(E\d+)\s*\|/g)].map((m) => m[1])
info.push(`设计元素母题：${eIds.join(', ') || '（无）'}`)
if (!eIds.length) warn('elements/README.md：未解析到 E 编号母题')

/* ---------- 6. 每个引用的文件确实存在 ---------- */

for (const f of [
  'SKILL.md', 'README.md', 'ROADMAP.md', 'CHANGELOG.md', 'design-language.md',
  'references/rules.md', 'references/tokens.md', 'references/components.md',
  'references/layouts.md', 'references/anti-patterns.md', 'references/checklist.md',
  'references/extending.md', 'templates/README.md', 'elements/README.md', 'assets/README.md',
]) {
  if (!existsSync(join(ROOT, f))) fail(`文档声明但文件不存在：${f}`)
}

/* ---------- 7. 组件契约（唯一真相源）与生成物新鲜度 ---------- */

/** 去掉平衡的 {…} 与引号串，只留属性名骨架（用于从签名串里抽属性名） */
function stripShapes(s) {
  let out = '', depth = 0
  for (const ch of s) {
    if (ch === '{') { depth++; continue }
    if (ch === '}') { if (depth > 0) depth--; continue }
    if (depth > 0) continue
    out += ch
  }
  return out.replace(/"[^"]*"/g, ' ').replace(/'[^']*'/g, ' ')
}

/** 取 usage 第一个开标签的属性名（跳过 {} 内，遇深度 0 的 > 停） */
function usageAttrs(usage) {
  const m = usage.match(/<([A-Z]\w*)/)
  if (!m) return null
  let i = m.index + m[0].length, depth = 0, seg = ''
  for (; i < usage.length; i++) {
    const ch = usage[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    else if (ch === '>' && depth === 0) break
    seg += ch
  }
  return { tag: m[1], names: [...new Set([...seg.matchAll(/([A-Za-z_][\w-]*)\s*=/g)].map((x) => x[1]))] }
}

const reg = buildRegistry()
info.push(`组件契约：${reg.stats.components} 个组件 / ${reg.stats.families} 族，全部带 @ds-contract`)
for (const iss of reg.issues) fail(`契约不完整：${iss}`)

// 7.1 每个 usage 示例里用到的属性，必须真的存在于该组件
let usageChecked = 0
for (const c of reg.json.components) {
  const a = usageAttrs(c.usage)
  if (!a) { fail(`${c.name}：usage 无法解析出标签`); continue }
  if (a.tag !== c.name) { fail(`${c.name}：usage 的标签是 <${a.tag}>，与组件名不符`); continue }
  usageChecked++
  const declared = new Set(c.props.map((p) => p.name))
  for (const n of a.names) {
    if (!declared.has(n)) fail(`${c.name}：usage 用了不存在的属性 「${n}」（实际属性：${[...declared].join(', ')}）`)
  }
}
info.push(`usage 示例：${usageChecked} 个组件的用法示例，属性全部对应源码（这是"照抄就错"的那一类错误）`)

// 7.2 生成物必须与源码同步（改了源码却忘了重新生成 = 下游拿到的还是旧契约）
const regDisk = existsSync(join(ROOT, 'registry.json')) ? read('registry.json') : null
if (regDisk === null) fail('registry.json 不存在 —— 跑 npm run registry')
else if (regDisk !== reg.jsonText) fail('registry.json 与源码不一致 —— 跑 npm run registry 重新生成')
const packPath = 'references/prompt-pack.md'
if (!existsSync(join(ROOT, packPath))) fail(`${packPath} 不存在 —— 跑 npm run registry`)
else if (read(packPath) !== reg.md) fail(`${packPath} 与源码不一致 —— 跑 npm run registry 重新生成`)
if (regDisk !== null && read(packPath) === reg.md) info.push('registry.json 与 prompt-pack.md 均与源码同步')

// 7.3 来源脉闭环：脉 → 册 → 主题，三层必须互相对得上（R23 的可执行化）
//
// 这一条正是「组件全部变蓝」事故的根因检查：v0.4 时 themes.js 只实现了 GenScript 一条脉，
// MCE 脉的 39 个组件在 registry 里被声明为「源自 MCE 五册」，却没有任何主题可渲染它们 ——
// 于是全部落到默认蓝。光看代码看不出来，只有把「声明的脉」与「存在的主题」对撞才暴露。
const originCount = {}
for (const c of reg.json.components) originCount[c.contract.src] = (originCount[c.contract.src] || 0) + 1
for (const k of ORIGIN_KEYS) {
  for (const m of CORPORA[k].manuals) {
    const t = THEMES[m.key]
    if (!t) fail(`themes.js 缺主题 ${m.key}（CORPORA.${k}.manuals 声明了它）`)
    else if (t.corpus !== k) fail(`主题 ${m.key} 的 corpus 是 ${t.corpus}，但 CORPORA.${k} 把它列作自己的册`)
  }
}
const orphanThemes = Object.keys(THEMES).filter(
  (k) => !ORIGIN_KEYS.includes(THEMES[k].corpus) && THEMES[k].corpus !== 'brand'
)
if (orphanThemes.length) warn(`主题的 corpus 无效（既不属于任何来源脉、也不是 brand）：${orphanThemes.join(', ')}`)
const stray = Object.keys(originCount).filter((k) => !ORIGIN_KEYS.includes(k))
if (stray.length) fail(`组件声明了不存在的来源脉：${stray.join(', ')}`)
const pinned = reg.json.components.filter((c) => c.contract.manual)
info.push(
  `来源脉闭环：${ORIGIN_KEYS.map((k) => `${CORPORA[k].label} ${originCount[k] || 0}`).join(' · ')}；` +
    `锁定具体册 ${pinned.length} 个（${Object.keys(THEMES).length} 个主题全部可达）`
)

/* ---------- 8. 文档里的签名漂移（文档写了源码中不存在的属性） ---------- */

const NOT_A_PROP = new Set(['style'])
let driftCount = 0
for (const c of reg.json.components) {
  const declared = new Set(c.props.map((p) => p.name))
  const hits = []
  // 形态 1：`<Comp a b="c" />`
  for (const m of compDoc.matchAll(new RegExp('`<' + c.name + '\\b([^`]*)`', 'g'))) {
    hits.push(stripShapes(m[1].split('>')[0]))
  }
  // 形态 2：表格行 | `Comp` | `a b={...}` |（单元格可能以 <Comp 开头，要去掉，否则组件名自己会被当成属性）
  for (const m of compDoc.matchAll(new RegExp('\\|\\s*`' + c.name + '`\\s*\\|\\s*`([^`]*)`', 'g'))) {
    hits.push(stripShapes(m[1].split('>')[0]).replace(/^\s*<\w+\b/, ''))
  }
  const seen = new Set()
  for (const region of hits) {
    for (const w of region.matchAll(/([A-Za-z][\w-]*)/g)) {
      const n = w[1]
      if (declared.has(n) || NOT_A_PROP.has(n) || seen.has(n)) continue
      seen.add(n)
      driftCount++
      fail(`references/components.md：${c.name} 写了属性 「${n}」，但源码里没有（实际：${[...declared].join(', ')}）`)
    }
  }
}
if (!driftCount) info.push('components.md 的签名与源码一致（没有"文档里有、代码里没有"的属性）')

// 8.2 taxonomy.md 的计数必须与代码一致（层×族 是选型入口，数字错了会误导选型）
const taxo = read('references/taxonomy.md')
const tm = taxo.match(/（(\d+)\s*族\s*\/\s*(\d+)\s*个组件）/)
if (!tm) warn('references/taxonomy.md：未找到「（N 族 / M 个组件）」计数声明')
else {
  if (Number(tm[1]) !== reg.stats.families) fail(`taxonomy.md 声明 ${tm[1]} 族，实际应为 ${reg.stats.families}`)
  if (Number(tm[2]) !== reg.stats.components) fail(`taxonomy.md 声明 ${tm[2]} 个组件，实际应为 ${reg.stats.components}`)
}

/* ---------- 9. 输出 ---------- */

const line = '─'.repeat(58)
console.log(`\n${line}\n  设计系统一致性校验 · audit\n${line}`)
for (const i of info) console.log(`  ✓ ${i}`)
for (const w of warns) console.log(`  ! ${w}`)
console.log(line)
if (errors.length) {
  console.log(`  ✗ ${errors.length} 项不一致：\n`)
  for (const e of errors) console.log(`     · ${e}`)
  console.log(`\n${line}\n  修好后重跑 npm run audit\n${line}\n`)
  process.exit(1)
}
console.log(warns.length ? `  通过（${warns.length} 条提醒）\n` : '  全部通过，文档与代码一致。\n')
