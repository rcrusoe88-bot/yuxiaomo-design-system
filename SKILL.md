---
name: yuxiaomo-design-system
description: 个人产品页设计系统（余小莫）。当需要为任何公司设计产品页 / 产品手册 / 服务手册 / 宣传册（A4 印刷页或 Web 页）时使用。系统提供 24 个可复用组件、多套品牌主题令牌、13 条可命名审美规则、7 个版式原型与 anti-slop 反模式清单，保证不同公司、不同项目的输出风格统一且不产生 AI slop。
---

# 个人产品页设计系统 · Yuxiaomo Design System

> 一句话：**一套设计语言 × 无限品牌主题。** 换品牌只改令牌，不重做设计。

## 这个系统解决什么问题

AI 从零设计产品页时会"发散"：每次配色、字阶、版式都重新猜，产出一眼假的通用模板（蓝紫渐变、居中大标题+灰色副标题、emoji、圆角阴影卡片堆叠）。本系统把"好设计"固化成**可命名的规则 + 可复用的组件 + 可套用的原型**，让 Agent 参照而非自由发挥。

## 使用流程（Agent 必须按序执行）

| 步骤 | 动作 | 读哪个文件 |
|---|---|---|
| 0 | 理解设计基因与底线 | `design-language.md` |
| 1 | 选定/新建品牌主题（色相家族） | `references/tokens.md` |
| 2 | 从 7 个版式原型挑页、排叙事顺序 | `references/layouts.md` |
| 3 | 用 24 个组件拼装每一页 | `references/components.md` |
| 4 | 遵守 13 条审美规则 | `references/rules.md` |
| 5 | 交付前逐条自检 + 扫反模式 | `references/checklist.md`、`references/anti-patterns.md` |

## 硬约束（不可违反）

1. **组件白名单**：每一页只能由 `src/lib/` 提供的组件拼成（`Cover`/`Page`/`PillTitle`/`SpecTable`/`StatCardRow`/`FlowChain`/`TimelineBar`/`CaseBlock`/`DataChart`/`ConclusionBanner`/`BackCover` …）。**禁止自创一次性组件或手写任意样式**；确需新组件时，先在 `src/lib/` 里新增可复用组件并补文档，而非在页面里硬写。
2. **一册一色相**（R1）：整本手册/整个页面只用一个色相家族，功能色、表头色、浅底、深底全在族内，**永不引入第二色相**（图表"阳性对照"橙 `#E8963C` 是唯一许可例外）。
3. **深底只属于结构页**（R2）：满版深色只允许封面、章节页、封底；内页永远白纸 + ≤10% 主题色实底点缀。
4. **只从已定义的主题取色**：禁止在页面里写死十六进制色值，一律用 `theme` 角色的令牌（见 `references/tokens.md`）。
5. **证据优先**：任何数字承诺必须可核查——卖点用卡、参数用表、证明用原始数据图。

## 反模式（见到即删，详见 references/anti-patterns.md）

- 蓝紫渐变背景、玻璃拟态、发光边框、投影堆叠
- emoji 当图标、彩色描边图标、图标风格混用
- "居中超大标题 + 灰色副标题 + 两个圆角按钮"的通用 hero 套路
- 一个页面出现 2 个以上实底胶囊标题（B1 一页只允许一个）
- 表格出现竖线 / 表头用浅色底深字（应实底白字）
- 深色底出现在内页正文区

## 技术栈与产物

- **组件库**：React 18（`src/lib/`），Vite 驱动，纯内联样式，零运行时依赖外部 UI 库。
- **载体 A（已落地）**：A4 印刷手册页（210×297mm）→ Playwright 导出 PDF。
- **载体 B（规划）**：Web 产品落地页（同令牌、px 栅格）。
- **产物**：可双击打开的 HTML 预览 + A4 PDF。

## 快速开始

```bash
npm install
node node_modules/vite/bin/vite.js --port 5173      # 预览 src/demo
node export-pdf.cjs output.pdf                       # 导出 A4 PDF
```

```jsx
import { ThemeProvider, Cover, Page, PillTitle, SpecTable, BackCover } from './src/lib'

<ThemeProvider theme="blue">
  <Cover title={<>mRNA-LNP<br />技术服务手册</>} enTitle="mRNA-LNP Service Brochure" />
  <Page number={1} folioSide="left">
    <PillTitle>端到端开发服务</PillTitle>
    <SpecTable columns={[...]} rows={[...]} />
  </Page>
  <BackCover contacts={[...]} version="2026-09-19" />
</ThemeProvider>
```

## 新增一家公司的产品页？只做三件事

1. 在 `src/lib/themes.js` 加一套主题（7 个角色 + 时间轴色带）。
2. 从 `references/layouts.md` 挑原型、按叙事铁律排序。
3. 填真实文案 + 真实素材（LOGO、实景/实验图）——**禁止杜撰品牌资产**。
