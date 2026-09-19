// 截图脚本：抓取 dev server 页面的每个 A4 页（等待字体后逐页截）
// 用法：node shot.cjs [port]   默认 5173
const { chromium } = require('playwright')

const PORT = process.argv[2] || process.env.PORT || '5173'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } })
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)
  const pages = await page.$$('.bds-page')
  console.log('A4 pages found:', pages.length)
  for (let i = 0; i < pages.length; i++) {
    await pages[i].scrollIntoViewIfNeeded()
    await page.waitForTimeout(150)
    await pages[i].screenshot({ path: `preview/p${String(i + 1).padStart(2, '0')}.png` })
  }
  console.log('errors:', errors.length ? errors : 'none')
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
