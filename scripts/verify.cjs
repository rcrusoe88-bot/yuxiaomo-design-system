// 溢出与运行时校验 —— verify
//
// 为什么必须单独有这一步：A4 分页骨架里每页是 `height: 297mm; overflow: hidden`，
// **内容超高不会报错，只会被静默裁掉**。构建通过 ≠ 页面没被裁。
// 本脚本逐页比对 scrollHeight 与 clientHeight，把"看不见的裁切"变成退出码。
//
// 同时收集 console 报错与 React 警告（如 key 缺失、无效 DOM 属性）。
//
// 用法：node scripts/verify.cjs [port]     端口默认 5173
// 注意：playwright 装在托管 node 工作区，须带 NODE_PATH 运行，且必须用 .cjs + require
//      （ESM 的 import 不认 NODE_PATH）。见 README「工具脚本」。
const { chromium } = require('playwright')

const PORT = process.argv[2] || process.env.PORT || 5173
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

  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)

  const report = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.bds-page')]
    return pages.map((el, i) => {
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
  })

  const line = '─'.repeat(58)
  console.log(`\n${line}\n  A4 溢出与运行时校验 · verify\n${line}`)
  let bad = 0
  for (const r of report) {
    const ok = r.overflowPx <= 1
    if (!ok) bad++
    console.log(
      `  ${ok ? '✓' : '✗'} p${String(r.page).padStart(2, '0')}  高 ${r.clientH}px  ` +
      (ok ? '无溢出' : `溢出 ${r.overflowPx}px ≈ ${(r.overflowPx / MM).toFixed(1)}mm`),
    )
    if (!ok && r.offenders.length) console.log(`       越界元素：${r.offenders.join('  ')}`)
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
    ? `  未通过：${bad} 页溢出、${errors.length} 条报错\n`
    : '  全部通过：无溢出、零报错\n')

  await browser.close()
  process.exit(bad || errors.length ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
