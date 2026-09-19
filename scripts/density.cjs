// 逐页密度校验 —— density
//
// 为什么需要它（与 verify.cjs 分工）：
//   verify.cjs 查「内容**超出**页面」（会被静默裁掉 → 是错误）；
//   density.cjs 查「内容**远未填满**页面」（不会被裁、也不会报错 → 是**质量问题**）。
// 一个 A4 内容页只占 52% 高度时，构建通过、无报错、截图也不"崩"，
// 但印出来就是半页空白 —— 只有量出来才看得见。
//
// 判据：正常流直接子元素的底边 / 页高。**必须排除 absolute 定位的子元素**
// （页码 Folio 是 absolute，否则每页都量成 96.6%，全部"合格"）。
// 封面类满版页（内容全在 absolute 层里）会量到 0%，属正常，不参与判定。
//
// 用法：node scripts/density.cjs [port]     端口默认 5173
// 注意：playwright 装在托管 node 工作区，须带 NODE_PATH 运行，且必须用 .cjs + require
//      （ESM 的 import 不认 NODE_PATH）。见 README「工具脚本」。
const { chromium } = require('playwright')

const PORT = process.argv[2] || process.env.PORT || 5173
const MM = 96 / 25.4
const LOW = 70 // 低于此值提示"偏空"
const HIGH = 93 // 高于此值提示"偏满"（接近 259mm 版心上限）

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } })
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(500)

  const rows = await page.evaluate(() => {
    const out = []
    document.querySelectorAll('.bds-page').forEach((el, i) => {
      const pr = el.getBoundingClientRect()
      let bottom = 0
      ;[...el.children].forEach((c) => {
        const pos = getComputedStyle(c).position
        if (pos === 'absolute' || pos === 'fixed') return
        const r = c.getBoundingClientRect()
        if (r.height > 0 && r.width > 0) bottom = Math.max(bottom, r.bottom - pr.top)
      })
      out.push({ page: i + 1, h: pr.height, bottom })
    })
    return out
  })

  const line = '─'.repeat(58)
  console.log(`\n${line}\n  A4 逐页密度校验 · density\n${line}`)
  let flagged = 0
  for (const r of rows) {
    if (r.bottom === 0) {
      console.log(`  · p${String(r.page).padStart(2, '0')}  满版页（内容在绝对层内），跳过`)
      continue
    }
    const pct = (r.bottom / r.h) * 100
    const mark = pct < LOW ? '!' : pct > HIGH ? '!' : '✓'
    if (mark === '!') flagged++
    const bar = '#'.repeat(Math.round(pct / 4)).padEnd(25, '.')
    console.log(
      `  ${mark} p${String(r.page).padStart(2, '0')}  ${pct.toFixed(1).padStart(5)}%  ` +
      `${(r.bottom / MM).toFixed(0).padStart(3)}mm / ${(r.h / MM).toFixed(0)}mm  ${bar}`,
    )
  }
  console.log(line)
  console.log(
    flagged
      ? `  ${flagged} 页不在 ${LOW}–${HIGH}% 区间：偏低=半页空白，偏高=接近版心上限（该拆页了）\n`
      : `  全部在 ${LOW}–${HIGH}% 区间，密度健康\n`,
  )
  await browser.close()
  // 密度是质量问题不是错误：永远退出 0，避免挡住构建
  process.exit(0)
}
main().catch((e) => { console.error(e); process.exit(1) })
