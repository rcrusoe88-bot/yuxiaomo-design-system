import React from 'react'
import { createRoot } from 'react-dom/client'
// 当前演示：组件分类陈列版（v0.4，按「页面槽位」组织的 71 个组件）
// 切换演示只需改这一行：
//   './demo/AppTaxonomy'    组件分类陈列（v0.4，封面 + 12 页，按「层 × 族」）
//   './demo/AppComponents'  组件陈列（v0.3，MCE 逆向新增 10 个组件）
//   './demo/AppYuantai'     mRNA-LNP 手册（5 主题切换）
//   './demo/App'            三主题巡展
import { AppTaxonomy as App } from './demo/AppTaxonomy'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
