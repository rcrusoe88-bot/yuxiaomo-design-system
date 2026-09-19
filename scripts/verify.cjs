// 溢出与运行时校验 —— verify
//
// 为什么必须单独有这一步：A4 分页骨架里每页是 `height: 297mm; overflow: hidden`，
// **内容超高不会报错，只会被静默裁掉**。构建通过 ≠ 页面没被裁。
// 本脚本逐页比对 scrollHeight 与 clientHeight，把"看不见的裁切"变成退出码。
//
// 同时收集 console 报错与 React 警告（如 key 缺失、无效 DOM 属性）。
//
// 用法：node scripts/verify.cjs [port] [path]     端口默认 5173，path 默认 /
//   例：node scripts/verify.cjs 5175                检 A4 分页骨架是否溢出
//       node scripts/verify.cjs 5175 "/?app=registry"  检提示词实验室（无 .bds-page 时做运行时校验）
// 注意：playwright 装在托管 node 工作区，须带 NODE_PATH 运行，且必须用 .cjs + require
//      （ESM 的 import 不认 NODE_PATH）。见 README「工具脚本」。
const { chromium } = require('playwright')

const PORT = process.argv[2] || process.env.PORT || 5173
const PATH = process.argv[3] || '/'
const MM = 96 / 25.4

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } })

  const errors = []
  const warnings = []
  page.on('console', (m) => {
    const t = m.text()
    if (m.type() === 'error') errors.push(t)
    else if (m.type() === 'warning' && !/DevTools|Download the React/.test(t)) warnings.push(t)
  })
  page.on('pageerror', (e) => errors.push('[pageerror] ' + e.message))

  await page.goto(`http://127.0.0.1:${PORT}${PATH}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)

  const report = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.bds-page')]
    const rows = pages.map((el, i) => {
      const pr = el.getBoundingClientRect()
      const offenders = [...el.children]
        .map((c) => ({
          tag: c.tagName.toLowerCase(),
          cls: typeof c.className === 'string' ? c.className : '',
          bottom: c.getBoundingClientRect().bottom - pr.top,
        }))
        .filter((c) => c.bottom > pr.height + 2)
        .map((c) => `${c.tag}${c.cls ? '.' + c.cls.slice(0, 22) : ''}@${Math.round(c.bottom / (96 / 25.4))}mm`)
      return {
        page: i + 1,
        clientH: el.clientHeight,
        overflowPx: el.scrollHeight - el.clientHeight,
        offenders,
      }
    })
    return { rows, bodyText: (document.body.innerText || '').length, rootHtml: (document.getElementById('root') || {}).innerHTML ? 1 : 0 }
  })

  const line = '─'.repeat(58)
  console.log(`\n${line}\n  A4 溢出与运行时校验 · verify   ${PATH}\n${line}`)
  let bad = 0
  for (const r of report.rows) {
    const ok = r.overflowPx <= 1
    if (!ok) bad++
    console.log(
      `  ${ok ? '✓' : '✗'} p${String(r.page).padStart(2, '0')}  高 ${r.clientH}px  ` +
      (ok ? '无溢出' : `溢出 ${r.overflowPx}px ≈ ${(r.overflowPx / MM).toFixed(1)}mm`),
    )
    if (!ok && r.offenders.length) console.log(`       越界元素：${r.offenders.join('  ')}`)
  }
  if (!report.rows.length) {
    // 工具页没有 A4 分页骨架。此时唯一会"静默失败"的是整页渲染不出来（如 JSON 导入失败），
    // 所以用「正文是否有内容」兜底 —— 空白页必须报错，而不是被判为"0 页溢出 = 通过"。
    const rendered = report.rootHtml && report.bodyText > 200
    if (!rendered) bad++
    console.log(`  ${rendered ? '✓' : '✗'} 无 A4 分页骨架；运行时渲染检查：正文 ${report.bodyText} 字` +
      (rendered ? '（页面正常）' : '（页面疑似渲染失败）'))
  }
  console.log(line)
  if (errors.length) {
    console.log(`  ✗ console 报错 ${errors.length} 条：`)
    for (const e of [...new Set(errors)].slice(0, 8)) console.log(`     · ${e.slice(0, 170)}`)
  }
  if (warnings.length) {
    console.log(`  ! 警告 ${warnings.length} 条（前 5）：`)
    for (const w of [...new Set(warnings)].slice(0, 5)) console.log(`     · ${w.slice(0, 170)}`)
  }
  if (!errors.length && !warnings.length) console.log('  ✓ 无 console 报错、无警告')
  console.log(line)
  console.log(bad || errors.length
    ? `  未通过：${bad} 项问题、${errors.length} 条报错\n`
    : '  全部通过：无溢出、零报错\n')

  await browser.close()
  process.exit(bad || errors.length ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
