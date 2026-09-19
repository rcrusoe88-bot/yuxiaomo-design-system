import React from 'react'
import { createRoot } from 'react-dom/client'
// 当前演示：组件陈列版（v0.3 新增 10 个组件）
// 切换演示只需改这一行：
//   './demo/AppComponents'  组件陈列（MCE 逆向新增组件）
//   './demo/AppYuantai'     mRNA-LNP 手册（5 主题切换）
//   './demo/App'            三主题巡展
import { AppComponents as App } from './demo/AppComponents'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
