// 导出 A4 PDF：遵循 SOP（printBackground + preferCSSPageSize + 等字体就绪）
// 用法：node export-pdf.cjs [输出文件名] [port] [path]
//   默认 components.pdf + 5173 + '/'（陈列页的「来源模式」）
//   path 可传 '/?mode=brand&brand=yuantai' 导出统一品牌色版本
const { chromium } = require('playwright')

async function main() {
  const out = process.argv[2] || 'components.pdf'
  const port = process.argv[3] || process.env.PORT || '5173'
  const path = process.argv[4] || '/'
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: out,
    printBackground: true,
    preferCSSPageSize: true,
  })
  console.log('PDF saved:', out)
  await browser.close()
}
main().catch((e) => { console.error(e); process.exit(1) })
