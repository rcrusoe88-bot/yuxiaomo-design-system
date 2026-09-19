// 导出 A4 PDF：遵循 SOP（printBackground + preferCSSPageSize + 等字体就绪）
// 用法：node export-pdf.cjs [输出文件名]
const { chromium } = require('playwright')

async function main() {
  const out = process.argv[2] || 'demo.pdf'
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
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
