# 组件 API · Components（71 个 / 14 族）

> 全部组件从 `src/lib` 导入，自动消费 `ThemeProvider` 注入的主题，**不接收硬编码色值**。
> 族 H / I / J 为 v0.3 新增，源自 MCE（皓元）五册逆向；族 K / M / N / O 与族 B/C/D/I 的扩展为 **v0.4** 新增，
> 源自 MCE 手册 11 页版式细读 —— 见 `行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md`。
> **选组件的入口是 `taxonomy.md`（按"层"定位）**；本文件按"族"组织，用于查签名。
> **计数口径**：`src/lib/index.js` 的全部组件导出（含 `Icon`、`CapsuleDecor`），不含色彩工具函数与常量。可用 `npm run audit` 自动核对。
> **要"照抄即用"请走 `registry.json` 与 `references/prompt-pack.md`** —— 两者由组件源码（`@ds-contract`）自动生成，含每个组件的语义契约、**来源配色**、真实 props 与可运行用法示例。本文件保留为"按族查签名"的索引。

```jsx
import { ThemeProvider, Cover, Page, PillTitle, SpecTable /* … */ } from './src/lib'
```

---

## 族 A · 结构页（唯一允许满版深底）

### `Cover` 封面
`<Cover title enTitle logo tagline style />`
深底满版 + 45° 等距平行胶囊棒（`CapsuleDecor preset="cover"`）+ 右上反白 logo/tagline + 右中标题组（中文主标 34pt Heavy + 英文副标）。`title` 可传 JSX（用 `<br/>` 断行）。

### `SectionDivider` 章节总览页
`<SectionDivider chapterNo title lead style>{岛内容}</SectionDivider>`
深底 + 左下角胶囊棒 + 左上章题/导语 + **下半页白色大圆角信息岛**。岛内常配 `IslandBulletGrid` 或总览表。

### `IslandBulletGrid` 六宫格
`<IslandBulletGrid groups={[{ title, bullets: [] }]} />`
3×N 网格，标题主题色粗体 + bullet 列表。

### `BackCover` 封底
`<BackCover contacts version heading style />`
`contacts: [{ type: 'web'|'phone'|'mail'|'addr', text }]`。满版胶囊棒矩阵（`preset="backcover"`）+ 左下联系列表 + 日期版本码。

---

## 族 B · 标题族（12 个：基础 5 + 形态变体 7）

> **v0.4 核心补齐**：v0.3 只有"胶囊 / 色字"两种，无法表达"章节页 / 技术页 / 有序章节"。
> 形态必须跟**语义**绑定，选型表见 `taxonomy.md` 层 2。

### 基础 5 态

| 组件 | 签名 | 说明 |
|---|---|---|
| `PillTitle` | `<PillTitle width>` | 实底 stadium 胶囊白字居中，**一页只允许一个** |
| `H2` | `<H2>` | 主题色粗体居中，无底无装饰 |
| `Sub` | `<Sub>` | H2 下的灰色定位句 |
| `Lead` | `<Lead>` | 通栏引导段落，两端对齐 |
| `Footnotes` | `<Footnotes items={[]} />` | `*` 开头灰色小字，与表左缘对齐 |

### v0.4 形态变体

| 组件 | 签名 | 说明 |
|---|---|---|
| `EyebrowTitle` | `items align divider tone` | **眉标**：小字 + 短色条，标章节归属，放在页题之上 |
| `PairTitle` | `cn en size` | **中英对照页题**（服务型手册主力）：中文实标题 + 英文浅色副题左对齐 |
| `BlockTitle` | `children en tone size` | **方块实底**页题：直角实底白字左对齐，技术感 / 硬朗 |
| `OutlineTitle` | `children en size inline` | **描边空心**页题：描边 + 主色字，轻量化 |
| `BarTitle` | `children sub en level` | **左色条小节标题**（H2 级）：左粗色条 + 黑字 |
| `RuleTitle` | `children en note ruleWidth` | **细线夹小节标题**（H2 级，最轻）：上下细线夹字 |
| `NumberedTitle` | `index total children en` | **编号页题**：大号数字 + 标题，用于有序章节 |

**纪律**：H1 一页一个；一份手册的 H2 只用一种（全用 `BarTitle` 或全用 `RuleTitle`）；H1 形态 ≤2 种。

---

## 族 K · 文本族（v0.4 新增，7 个）

> v0.3 的文本层只有 `Lead` / `Sub` / `Footnotes`，而文本是手册占比最大的内容层。
> **唯一允许的文本高亮是行内加粗**：`renderRich()` 把 `**x**` 渲染为 `<strong>`——不加色、不加底、不加下划线。

### `BodyText` 正文段落
`<BodyText text columns={1|2} size="sm"|"md" style />`
支持 `columns=2` 多栏流式（CSS `columnCount`）。`text` 内可用 `**加粗**`。
**多栏只用于无小标题的连续论述**；需分点时改用下面的列表。

### `FigCaption` 图注
`<FigCaption tone="strong"|"soft" align />`
**图注在下**（MCE 惯例）：`strong` = 加粗深灰说明；`soft` = 次级灰补充。

### `BulletList` 圆点列表
`<BulletList items={[]} columns={1|2} size />`
并列、**无先后**。圆点为主题色。条目支持 `**加粗**`。

### `NumberedList` 数字列表
`<NumberedList items={[]} columns={1|2} start={1} size />`
并列、**有先后**。数字为主题色等宽右对齐成列 —— **第 10 项不会把文字推歪**。

### `DefinitionList` 定义列表
`<DefinitionList items={[{ term, en, desc }]} rule />`
"术语 → 释义"连续阅读块，**无底色**（与 `KeyValueTable` 的分工见族 C）。

### `NoteBand` 提示带
`<NoteBand text tone="tint"|"line"|"solid" icon label />`
通栏提示条，三种语体：`tint` 浅底 / `line` 仅上边框 / `solid` 实底反白。
用于"注意 / 用哪个 / 为什么这样做"这类编者提示。`text` 支持 `**加粗**`。

### `AnnotationPair` 注解对
`<AnnotationPair cn="现象" en="Explanation" divider />`
左右对照的两栏注解（左=现象、右=解释），中间细竖线分隔。

---

## 族 G · 页面骨架与图标

| 组件 | 签名 | 说明 |
|---|---|---|
| `Page` | `number folioSide="left"\|"right"` | A4 页面容器（210×297mm，自动页码）。`height:297mm + overflow:hidden` → **超高会被静默裁掉，必须跑 `npm run verify`** |
| `Folio` | `num side color` | `– 0X –` 页码，奇偶左右交替 |
| `Icon` | `name size primary secondary` | 面性双色 SVG 图标 |
| `CapsuleDecor` | `preset="cover"\|"backcover"\|"divider"` | **装饰原语**（母题 E01「胶囊棒束」）：45° 等距平行圆头长条，按 `d = x − y` 定位。通常由 `Cover` / `BackCover` / `SectionDivider` 内部调用，**不单独在页面里手写**；确需自定义布点时才直接用。 |
| `ICON_NAMES` | — | 16 个图标名：`flask timer truck shield award chart dna gear box cell link globe phone mail pin check` |

---

## 族 C · 表格族（6 个，全部遵守 R5：实底表头 + 无竖线）

> **先判语体再选组件（R16）**：营销参数表 vs 技术数据表，不可混在一页。

### `SpecTable` 实底表头参数表 ★最常用（营销语体）
`<SpecTable columns={[]} rows={[]} labelColumn zebra fontSize style />`
- 单元格可传字符串或对象：`{ v, rowSpan, colSpan, highlight, bold, align }`
- `highlight: true` → tint 底 + 主题色加粗（**用于 R8 承诺数字高亮**）
- `labelColumn` → 首列作标签列（tint 底加粗）
- 合并单元格：被合并处传 `null` 占位

### `TierMatrixTable` 三档色阶矩阵表
`<TierMatrixTable tiers={['RUO','IND','cGMP']} features={[{ name, values:[true,true,true] }]} />`
列头同色系深浅递进（深浅 = 承诺强度）；`true`→✓、`false`→—。

### `ProductHeaderRow` 通栏合并头行
`<ProductHeaderRow title colSpan />`（放进 `SpecTable` 的 rows 里当产品名分隔行）

### `RowLabelMatrixTable` 行标签矩阵表（v0.4）
`<RowLabelMatrixTable columns={[{ label, sub, image }]} rows={[{ label, cells: [] }]} divider />`
**行标签在左、列 = 产品/方案**，列头可挂图（`headerImage`）。
用于"多产品 × 多维度"的选型对照——比把产品放在首列更易横向比较。

### `MethodTable` 方法学表（v0.4）
`<MethodTable rows={[{ cn, abbr, en, desc }]} headers={['方法','用途']} caption />`
左列**中文名 + 英文缩写分行**（技术服务页的主力表）。用于方法学清单、检测项目清单。

### `KeyValueTable` 键值属性表（v0.4）
`<KeyValueTable items={[{ k, v }]} labelWidth="32mm" divided />`
**无列头**两列纵排：左键（tint 底加粗）右值。
**与 `DefinitionList` 的分工**：`DefinitionList` = "术语→释义"的连续阅读块（无底色）；
本组件 = "属性→取值"的**清单**（有底色、可读性优先，用于选型决策）。

---

## 族 D · 卡片族（7 个，共同签名 R6：右上 scoop 大圆角）

| 组件 | 签名 | 说明 |
|---|---|---|
| `StatCardRow` | `items={[{ icon, title, desc }]}` | 一行 3~4 张等宽卖点卡，tint→zebra 渐变底 |
| `TierCards` | `tiers={[{ name, cycle, price, desc }]} footnote` | 三档套餐卡，顶部 header 色实条 + 主题色"周期，价格" |
| `TestimonialCard` | `quote name org avatar` | 渐变面板 + 超大引号 + 头像 + 虚线分隔 |
| `ConclusionBanner` | `tone="tint"\|"solid"` | 通栏全圆胶囊结论横幅；`solid` 版 = CTA |
| `ProductCardGrid` | `items={[{ category, code, name, desc, en }]} columns={3} palette headerTone` | **v0.4** 产品/服务卡网格：类目条 + 标题 + 英文 + 描述（**类目条默认同色相**，见 R22） |
| `MetricStrip` | `items={[{ value, unit, label, en }]} columns accent` | **v0.4** 大数字指标条：细上下线夹、无框（MCE p11 惯例）；`highlight` 标关键项 |
| `TocList` | `items={[{ no, title, en, page }]} columns` | **v0.4** 目录条目：`leaders` 用 dotted 边框做点线引导（不用重复字符） |

---

## 族 E · 流程族（底座，R9：流程下必跟时间轴）

| 组件 | 签名 | 说明 |
|---|---|---|
| `FlowChain` | `steps={[{ name, cycle, desc, bullets }]} numbered` | 白框 + 顶部实头条 + `›` 连接 |
| `IconFlowBar` | `steps={[{ icon, name }]}` | 细描边大容器 + 面性图标横排 |
| `TimelineBar` | `segments={[{ label, weeks }]} total` | **段宽 ∝ 时长**，ramp 色带递进 + 通栏箭头 + 黑粗总周期 |
| `ChevronFlow` | `steps={[]} variant="process"\|"funnel"` | 燕尾咬合箭头带；`funnel` 反向渐变表达漏斗 |

---

## 族 F · 案例与证据族

| 组件 | 签名 | 说明 |
|---|---|---|
| `CaseBlock` | `title facts={[{ k, v }]}` | 案例三段式（技术难点/解决方案/结果），纯排版无底色 |
| `EvidenceGrid` | `images={[{ src, caption }]} note cols highlight` | 原始实验图直角平铺；`highlight={ imgIndex,x,y,w,h }` 画**绿色虚线圈选**（唯一允许的编辑干预） |
| `DataChart` | `groups={[{ label, a, b, control }]} max unit seriesNames` | 柱状图双系列（浅档 `capsuleLight` + 深档 `functional`），`control:true` 用橙 `#E8963C` |

---

## 族 H · 流程与图解族（v0.3，规则 R14「一站一拓扑」）

> 核心纪律：**不同语义配不同拓扑**，绝不把同一种流程图复用在不同语义的页面上。

### `StagePipelineChain` 阶段管线链 ★总图首选
`<StagePipelineChain stages={[]} spectrum={[]} caption nodeSize={18} />`
- 横向圆形节点 + `›` 箭头；节点可为字符串或 `{ label, active }`（`active` = 实底高亮当前阶段）
- `spectrum` → 底部斜纹长条上骑缝放胶囊标签，用于表达"服务边界"（如 `['CRO','CDMO','CMO']`，最后一个自动用浅档色）
- **用法铁律**：节点名必须与后续每页的 L2 标题一一对应，形成**总-分锚定**——读者永远知道讲到流程哪一站。

### `FunnelStages` 量化收敛漏斗
`<FunnelStages stages={[{ method, label, value, highlight }]} caption minWidth={42} />`
逐层收窄横条 + 左侧虚线引线方法名 + 右侧量化数字；`highlight` 标记关键层（浅档色）。
⚠️ `value` 里的数字是**对外承诺**，必须来自真实数据，禁止编造。

### `CycleFlowDiagram` 环形迭代图
`<CycleFlowDiagram nodes={[{ label, icon }]} center caption size={54} />`
渐变环（吃 `ramp` 四档）+ 四角图标节点 + 中心标签圆。最多 4 个节点（按 tl→tr→br→bl 顺序）。

### `ComboEquationDiagram` 组合公式图
`<ComboEquationDiagram left={{title,items}} right={{title,items}} result={{title,items}} caption />`
「A ＋ B » 产物」三栏公式式布局，每栏 = 胶囊标题 + 药丸堆叠清单。

---

## 族 M · 拓扑图族（v0.4 新增，6 个）

> **v0.4 的核心补齐**：v0.3 只有"链 / 漏斗 / 环 / 公式"4 个拓扑，遇到"编号步骤""并列条件""实验动作""多入口汇聚""时间轴位置"时只能硬套，导致语义漂移。
> **一语义一拓扑**（R14）。选择表见 `taxonomy.md` 层 5。
> 所有拓扑共享 `palette` 参数（`tone` 默认 / `category` 需显式）与 `caption`。

### `NumberedStepFlow` 编号步骤流 ★流程页主力
`<NumberedStepFlow steps={[{ no, title, en, desc, color }]} palette size="md"|"sm" caption />`
每步 = 大号实心圆（`01`–`06`）+ 同色描边盒（标题 + 英文 + 描述）+ 步间 `›`。
**与 `FlowChain` 的分工**：`FlowChain` = 顶部实色**条**的表头框链（正统、正式）；
本组件 = 圆形**编号** + 描边盒（更亲和，更适合"实验步骤"）。

### `HexChain` 六边形图标链 ★"套餐包含什么"
`<HexChain items={[{ icon, label, en, color }]} connector="+" palette="tone" size={19} caption />`
6 个六边形图标 + 下方 `⊕` 连接符。**语义 = 并列的条件项**（A + B + C，无先后，缺一不可）。
`palette` 默认 `tone`（同色相多档，守 R22）——各六边形是同一套餐的组成件，不是不同类目。
**与 `IconFlowBar` 的分工**：`IconFlowBar` 用 `›`（有方向），本组件用 `⊕`（无方向、相加）。

### `BeadChain` 实验动作链
`<BeadChain steps={[{ label, en }]} palette caption />`
带质感圆珠串成动作链，表达"我们是怎么做的"（亲和、过程感）。

### `AnnotatedCycle` 标注环形流程
`<AnnotatedCycle nodes={[{ label, sub }]} center={{ label, sub }} radius={34} nodeWidth="28mm" caption />`
N 节点沿圆周落位 + **顺时针弧箭头** + 中心标签。表达**闭环迭代**（回到起点）。
**与 `CycleFlowDiagram` 的分工**：`CycleFlowDiagram` 是 4 节点固定的渐变环；本组件节点数可变、可写主副标签。

### `ServiceNetworkMap` 服务网络图（第 6 种拓扑）
`<ServiceNetworkMap columns={3} nodes={[{ col, row, label, en, span, arrow, tone }]} captions={[{ col, row, span, cn, en, align }]} caption />`
- `arrow: 'right'|'down'|'both'`；`tone: 'deep'` → 实底（标中枢）
- **语义 = 上下游依赖**：多个入口 → 汇聚到中枢 → 再分出多条出口。链与环都表达不了。
- **布局纪律**：节点用 `col/row` 显式落位，箭头**只挂在自身右缘或下缘** —— 不计算两点连线，所以改字长不会错位。
- **配比纪律**：入口数、出口数不必相等，但**中枢必须独占一整行并跨满列数**，否则"汇聚"的语义看不出来。

### `PhaseBand` 阶段带
`<PhaseBand stages={[]} phases={[{ label, span }]} active axis caption />`
多段色带（每段一色 + 白字）+ 上方括注（把若干段归入大阶段）+ 下方细横轴 + 末端箭头。
`active` 传下标（或数组）时其余段降透明度 → 表达"我们的服务覆盖第 3–5 段"。
**语义 = 时间轴上的位置**，不是流程步骤。

---

## 族 I · 数据与证据族（v0.3 3 个 + v0.4 3 个）

> 核心纪律：**图表默认单色**，只有"两组对比"才引入第二色；图注在下、功能标题在右。

### `TargetBarChart` 排序条形图 ★替代饼图
`<TargetBarChart items={[{ label, value, color }]} ticks={5} caption barColor labelWidth="46mm" />`
**轴在顶部**（与 MCE 一致）+ 右侧对齐的类别标签列 + 单色横条，自动把最大值收成"好看的整刻度"。
`caption` 渲染为**右下角加粗深灰**。适合靶点举例 / 参数分布 / 品类计数。

### `InstrumentReportPanel` 仪器报告面板 ★QC 检测页首选（技术语体）
`<InstrumentReportPanel blocks={[{ label, chart } | { label, columns, rows, total }]} />`
浅色标题条 + **图与数据表同框**，容器仅一圈极浅描边；表内**无竖线**、表头浅底深灰字、斑马纹、`total` 行带顶线。
**与 `SpecTable` 的分工**：`SpecTable` = 实底表头的营销参数表；本组件 = 浅底细线的技术数据表。**两种语体按页型选用，不要混**。

### `CitationBlock` 文献引用块
`<CitationBlock title items={[{ journal, text }]} columns={2} icon />`
期刊名加粗深灰 + 卷期页次级灰，CSS 多栏流式（`breakInside: avoid` 防跨栏断行）。用于**信任页**。

### `PanelBarChart` 小倍数面板条形图（v0.4）
`<PanelBarChart panels={[{ title, items=[{label,value}] }]} columns={2} ticks={4} sharedScale labelWidth caption />`
竖基线 + 顶部刻度 + 左类别的多面板条形图。
**`sharedScale` 是关键**：多面板**必须共享刻度**才能横向比较；各面板各自缩放会读出错结论。

### `AnnotatedDonut` 注释甜甜圈（v0.4）
`<AnnotatedDonut size={48} segments={[{ label, points: [] }]} center caption />`
构成占比 + **逐块注解**。**注解块标题色 == 扇区色** —— 这是 R21「类目色恒定」的实证用法。

### `ScatterClusterPanel` 分布聚类面板（v0.4）
`<ScatterClusterPanel clusters={[{ x, y, r, color }]} legend={[{ label, color }]} seed={7} />`
**分布形态本身就是信息**（聚类 / 离散 / 分层）。用确定性种子生成，同一 `seed` 每次渲染一致。

---

## 族 N · 图解族（v0.4 新增，3 个）

> 用途：给"插画 / 示意图 / 色卡"装一个统一外壳，避免每页自己手写框。
> **`LegendFigure` 缺图时渲染"待补插图"占位框，而不是伪科学图** —— 宁可留白，不可编造。

### `FigurePanel` 图解外壳
`<FigurePanel title="LNP 结构" caption="图 3" tone="tint">{内容或图}</FigurePanel>`
统一的图框：标题 + 英文副题 + 内容区 + 图注 + 备注行。

### `LegendFigure` 带图例的三栏图
`<LegendFigure title="靶点" items={[{ label, side }]} artWidth="58mm" />`
`1fr / auto / 1fr` 三栏网格：左右各列若干标注项，中间放图（或占位框）。

### `SwatchLegend` 色卡图例
`<SwatchLegend items={[{ color, label }]} direction="row" />`
色块 + 标签 + 英文的图例网格（用于配方 / 分组 / 分级说明）。

---

## 族 J · 标签与图标列表族（v0.3）

> 核心纪律「同色系自配」：任何彩色元素都是"浅色底 + 同色相深一阶字"，从不跨色相配对。
> 色相由主题主色经 `toneRamp()` 派生 —— 因此**换主题自动换肤**，组件内不出现任何硬编码色值。

### `CategoryTagRow` 类目胶囊标签行
`<CategoryTagRow items={[{ label, color }]} size="md"|"sm" />`
水平自动换行的圆角胶囊；元素可为字符串或 `{ label, color, fg }`。
**规则「类目色恒定」（R21）**：同一类目在全册任何页应保持同一色 —— 若要固定，用 `color` 显式指定。

### `ChipPillGrid` 芯片标签网格
`<ChipPillGrid items={[{ label, icon }]} columns={3} />`
浅底圆角芯片 + 行内小图标，2–3 列。用于子能力清单。

### `IconFeatureList` 图标特性列表
`<IconFeatureList items={[{ icon, title, points: [], text, color }]} columns={3} />`
**实心彩圆图标**（白线图标）+ 彩色标题 + 圆点列表。
规则「图标必入容器」（R17）：图标从不裸放，容器色即语义色。

---

## 族 O · 页眉页脚（v0.4 新增，2 个）

| 组件 | 签名 | 说明 |
|---|---|---|
| `BrandHeaderBar` | `brand tagline meta right rule` | **内页页眉品牌条**：左 LOGO/品牌名、右页码，可加下细线（`rule`）。**注意 `@page` 无 margin box**，页眉必须画在 `.page` 内部 |
| `ContactFooterBand` | `heading items={[{ type, text }]} tone columns` | **内页联系带**：网页/电话/邮箱/地址 + 备注。三种语体同 `NoteBand` |

---

## 色彩工具（供自定义组件派生浅色系）

| 函数 | 说明 |
|---|---|
| `toneRamp(baseHex, n)` | **同色相多档**（`spread=0`）—— **组件多档配色的默认**（R22） |
| `categoryRamp(baseHex, n)` | **跨色相分类色**（`spread=1`）—— 仅当颜色本身有类目含义时用 |
| `pastelRamp(baseHex, n, { spread, sat, light })` | 通用入口，v0.3 旧签名默认跨色相；返回 `{ bg, fg, base }` |
| `mixWhite(hex, amt)` / `mixBlack(hex, amt)` | 与白/黑混合 |
| `shiftHue(hex, deg)` | 色相偏移 |
| `hexToRgb` / `rgbToHex` / `rgbToHsl` / `hslToRgb` | 基础转换 |
| `renderRich(text)` | 把 `**x**` 渲染为 `<strong>` —— **唯一允许的文本高亮**（族 K 内部使用） |

**为什么要它**：让组件从主题令牌**派生**浅色系，从而不必在组件里写死 hex（硬约束 R4）。

---

## 组合范式（一页 = 一个原型）

```jsx
<Page number={1} folioSide="left">
  <PillTitle>端到端 mRNA-LNP 开发服务</PillTitle>   {/* 一页一个 */}
  <Lead>作为一站式 CDMO 服务商…</Lead>
  <StatCardRow items={[…4 张]} />
  <H2>服务流程</H2>
  <FlowChain steps={[…4 步]} />
  <TimelineBar segments={[…]} total="快至 2.5 周交付" />
</Page>
```

**新增需求时**：优先用现有组件拼；确需新组件，加到 `src/lib/` 并向本文件补一行，禁止在页面内硬写一次性样式。
