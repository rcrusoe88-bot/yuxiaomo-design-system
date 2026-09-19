import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppTaxonomy } from './demo/AppTaxonomy'
import { AppRegistry } from './demo/AppRegistry'
import './styles.css'

// 应用切换（改 URL 即可，不用改代码）：
//   /              组件分类陈列（v0.4，封面 + 12 页，按「层 × 族」）
//   /?app=registry  组件提示词实验室（复制提示词 / 配置代码 / 源码 / import）
// 其它历史演示仍在 src/demo/ 下（App / AppComponents / AppYuantai），需要时换 import 即可。
const app = new URLSearchParams(window.location.search).get('app')
const App = app === 'registry' ? AppRegistry : AppTaxonomy

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
