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

/* ---------- 7. 输出 ---------- */

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
