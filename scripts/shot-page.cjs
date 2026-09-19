// 整页截图 —— 用于**非** A4 分页的页面（如提示词实验室 /?app=registry）
//
// 为什么单独一个脚本：shot.cjs 是逐页抓 `.bds-page`（A4 骨架专用），
// 提示词实验室没有 .bds-page，用 shot.cjs 只会输出 "A4 pages found: 0"。
//
// 用法：node scripts/shot-page.cjs [port] [path] [outPrefix] [viewportWidth]
//   例：node scripts/shot-page.cjs 5175 "/?app=registry" preview/lab 1280
// 产出：<outPrefix>-top.png（首屏）与 <outPrefix>-full.png（整页）
// 注意：playwright 装在托管 node 工作区，须带 NODE_PATH 运行，且必须用 .cjs + require
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const PORT = process.argv[2] || '5173'
const PAGE_PATH = process.argv[3] || '/'
const PREFIX = process.argv[4] || 'preview/page'
const WIDTH = Number(process.argv[5] || 1280)

async function main() {
  fs.mkdirSync(path.dirname(PREFIX), { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 1400 } })
  const errors = []
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })

  await page.goto(`http://127.0.0.1:${PORT}${PAGE_PATH}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(600)

  const text = await page.evaluate(() => (document.body.innerText || '').length)
  console.log('body text length:', text)

  await page.screenshot({ path: PREFIX + '-top.png' })
  await page.screenshot({ path: PREFIX + '-full.png', fullPage: true })

  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  console.log('full page height:', h + 'px')
  console.log('saved:', PREFIX + '-top.png', '/', PREFIX + '-full.png')
  console.log('errors:', errors.length ? errors : 'none')

  await browser.close()
  if (errors.length) process.exit(1)
}

main().catch((e) => { console.error(e); process.exit(1) })
