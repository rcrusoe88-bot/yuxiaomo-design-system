---
name: yuxiaomo-design-system
description: 公司产品服务手册设计系统（余小莫）。当需要为公司与产品或服务设计 A4 印刷手册 / 服务手册 / 产品宣传册（PDF 交付）时使用。系统提供 71 个可复用组件、5 套品牌主题令牌、23 条可命名审美规则、7 个版式原型、整页模板与 anti-slop 反模式清单，保证不同公司、不同项目的输出风格统一且不产生 AI slop。
---

# 公司产品服务手册设计系统 · Yuxiaomo Design System

> 一句话：**一套设计语言 × 无限品牌主题。** 换品牌只改令牌，不重做设计。
>
> **定位**：为公司产品与服务设计**产品手册 / 服务手册 / 宣传册**，主载体是 **A4 印刷页（210×297mm）→ PDF 交付**。Web 落地页为规划中的第二载体（见 `ROADMAP.md`）。

## 这个系统解决什么问题

AI 从零设计产品页时会"发散"：每次配色、字阶、版式都重新猜，产出一眼假的通用模板（蓝紫渐变、居中大标题+灰色副标题、emoji、圆角阴影卡片堆叠）。本系统把"好设计"固化成**可命名的规则 + 可复用的组件 + 可套用的原型**，让 Agent 参照而非自由发挥。

## 使用流程（Agent 必须按序执行）

| 步骤 | 动作 | 读哪个文件 |
|---|---|---|
| 0 | 理解设计基因与底线 | `design-language.md` |
| 1 | 选定/新建品牌主题（色相家族） | `references/tokens.md` |
| 2 | 从 7 个版式原型（L1–L7）挑页、排叙事顺序 | `references/layouts.md` |
| 3 | **按"层"选组件**，再用 71 个组件（14 族）拼装每一页。**精确复现请读 `registry.json`**（每个组件的语义 / 何时不用 / 来源脉 `src` 与锁定册 `manual` / 真实 props / 可运行用法） | `references/taxonomy.md` → `registry.json`（或 `references/prompt-pack.md`） |
| 4 | 遵守 23 条审美规则（R1–R23） | `references/rules.md` |
| 5 | 交付前逐条自检 + 扫反模式 | `references/checklist.md`、`references/anti-patterns.md` |
| 6 | **A4 双机械校验**：溢出 + 密度（`build` 查不出这两个） | `npm run verify`、`npm run density` |
| 7 | 改了本系统自身？跑一致性校验 | `npm run audit` |

> **为什么第 6 步不可省**：A4 骨架里每页是 `height:297mm; overflow:hidden`。
> 内容**超出**会被静默裁掉（不报错）；内容**没填满**则是半页空白（也不报错）。
> 两者都只能靠机械校验发现 —— 见 `README.md`「工具脚本」。

### 编号命名空间（不要混用）

| 命名空间 | 含义 | 定义处 |
|---|---|---|
| `R1–R23` | 可命名审美规则 | `references/rules.md` |
| 族 `A–O` | 组件族（71 个组件 / 14 族） | `references/components.md` |
| `L1–L7` | 版式原型（页面**句型**） | `references/layouts.md` |
| `T01–T07` | 整页模板（装配好的**成品页**） | `templates/README.md` |
| `E01–E0x` | 设计元素母题 | `elements/README.md` |
| `X1–X6` | 扩展 SOP 类型 | `references/extending.md` |

## 硬约束（不可违反）

1. **组件白名单**：每一页只能由 `src/lib/` 提供的组件拼成（71 个 / 14 族）。常用：`Cover`/`Page`/`PillTitle`/`SpecTable`/`StatCardRow`/`FlowChain`/`TimelineBar`/`CaseBlock`/`DataChart`/`ConclusionBanner`/`BackCover`；v0.3 新增：`StagePipelineChain`/`FunnelStages`/`CycleFlowDiagram`/`ComboEquationDiagram`/`TargetBarChart`/`InstrumentReportPanel`/`CitationBlock`/`CategoryTagRow`/`ChipPillGrid`/`IconFeatureList`；v0.4 新增（34 个）：标题 7 变体（`PairTitle`/`BlockTitle`/`BarTitle`/`RuleTitle`/`EyebrowTitle`/`OutlineTitle`/`NumberedTitle`）、文本族 K（`BodyText`/`BulletList`/`NumberedList`/`DefinitionList`/`NoteBand`/`AnnotationPair`/`FigCaption`）、表格 3（`RowLabelMatrixTable`/`MethodTable`/`KeyValueTable`）、卡片 3（`ProductCardGrid`/`MetricStrip`/`TocList`）、拓扑族 M（`NumberedStepFlow`/`HexChain`/`BeadChain`/`AnnotatedCycle`/`ServiceNetworkMap`/`PhaseBand`）、图表 3（`PanelBarChart`/`AnnotatedDonut`/`ScatterClusterPanel`）、图解族 N（`FigurePanel`/`LegendFigure`/`SwatchLegend`）、页眉页脚族 O（`BrandHeaderBar`/`ContactFooterBand`）。**禁止自创一次性组件或手写任意样式**；确需新组件时，先在 `src/lib/` 里新增可复用组件并补文档，而非在页面里硬写。
2. **一册一色相**（R1）：整本手册/整个页面只用一个色相家族，功能色、表头色、浅底、深底全在族内，**永不引入第二色相**（图表"阳性对照"橙 `#E8963C` 是唯一许可例外）。
3. **深底只属于结构页**（R2）：满版深色只允许封面、章节页、封底；内页永远白纸 + ≤10% 主题色实底点缀。
4. **只从已定义的主题取色**：禁止在页面里写死十六进制色值，一律用 `theme` 角色的令牌（见 `references/tokens.md`）。需要浅色系时用 `pastelRamp(theme.functional, n)` **派生**，不要手填。
5. **证据优先**（R7）：任何数字承诺必须可核查——卖点用卡、参数用表、证明用原始数据图。
6. **表格语体按页型选**（R16）：营销参数页用 `SpecTable`（实底反白表头）；技术数据页用 `InstrumentReportPanel`（浅底细线表头）。**两者不可互换、不可混在一页**。无论哪种，**一律无竖线**。
7. **配色随来源，不随默认**（R23）：组件的颜色由**其来源脉的主题**决定（`registry.json` 的 `contract.src` = `genscript` / `mce` / `neutral`；有 `contract.manual` 时按它锁定到具体一册）。**不得把所有组件统一成同一种颜色（尤其默认蓝）** —— MCE 五册同一套组件、五种色相，归一化会丢掉来源辨识度。**同脉内换册只换主色、不换结构；跨脉取色是错的。**
8. **照抄即用只信 `registry.json`**：它的属性名由源码提取、并经 `npm run audit` 反查。`references/components.md` 是"按族查签名"的索引；两者不一致时以 `registry.json` 为准（并跑 `npm run audit` 修文档）。

## 反模式（见到即删，详见 references/anti-patterns.md）

- 蓝紫渐变背景、玻璃拟态、发光边框、投影堆叠
- emoji 当图标、彩色描边图标、图标风格混用
- "居中超大标题 + 灰色副标题 + 两个圆角按钮"的通用 hero 套路
- 一个页面出现 2 个以上实底胶囊标题（`PillTitle` 一页只允许一个）
- **表格出现竖线**；**营销参数表**用浅色底深字表头（该用实底反白）；**技术数据表**却用实底反白表头（该用浅底细线）—— 违反 R5 / R16
- 深色底出现在内页正文区
- 同一个"流程/收敛/迭代"语义全册复用同一种图（违反 R14 一站一拓扑）
- **多档配色组件跨色相、但这些颜色并不代表类目**（违反 R22 类目色纪律）—— 不传 `palette` 默认就是同色相多档
- **把所有组件刷成同一种颜色（尤其通用蓝）**（违反 R23 配色随来源）—— 每个组件都有来源色相，见 `registry.json`
- 一页出现 3 种以上标题形态，或全册 H2 时而色条、时而细线夹（违反族 B 的形态纪律）

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
