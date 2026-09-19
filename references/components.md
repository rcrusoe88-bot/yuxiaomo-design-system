# 组件 API · Components（34 个 / 10 族）

> 全部组件从 `src/lib` 导入，自动消费 `ThemeProvider` 注入的主题，**不接收硬编码色值**。
> 族 H / I / J 为 v0.3 新增，源自 MCE（皓元）五册逆向 —— 见 `行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md`。

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

## 族 B · 标题系统

| 组件 | 签名 | 说明 |
|---|---|---|
| `PillTitle` | `<PillTitle width>` | 实底 stadium 胶囊白字居中，**一页只允许一个** |
| `H2` | `<H2>` | 主题色粗体居中，无底无装饰 |
| `Sub` | `<Sub>` | H2 下的灰色定位句 |
| `Lead` | `<Lead>` | 通栏引导段落，两端对齐 |
| `Footnotes` | `<Footnotes items={[]} />` | `*` 开头灰色小字，与表左缘对齐 |

---

## 族 C · 表格族（全部遵守 R5：实底表头 + 无竖线）

### `SpecTable` 实底表头参数表 ★最常用
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

---

## 族 D · 卡片族（共同签名 R6：右上 scoop 大圆角）

| 组件 | 签名 | 说明 |
|---|---|---|
| `StatCardRow` | `items={[{ icon, title, desc }]}` | 一行 3~4 张等宽卖点卡，tint→zebra 渐变底 |
| `TierCards` | `tiers={[{ name, cycle, price, desc }]} footnote` | 三档套餐卡，顶部 header 色实条 + 主题色"周期，价格" |
| `TestimonialCard` | `quote name org avatar` | 渐变面板 + 超大引号 + 头像 + 虚线分隔 |
| `ConclusionBanner` | `tone="tint"\|"solid"` | 通栏全圆胶囊结论横幅；`solid` 版 = CTA |

---

## 族 E · 流程族（R9：流程下必跟时间轴）

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

## 族 G · 收尾与家具

| 组件 | 签名 | 说明 |
|---|---|---|
| `Page` | `number folioSide="left"\|"right"` | A4 页面容器（210×297mm，自动页码） |
| `Folio` | `num side color` | `– 0X –` 页码，奇偶左右交替 |
| `Icon` | `name size primary secondary` | 面性双色 SVG 图标 |
| `ICON_NAMES` | — | 16 个图标名：`flask timer truck shield award chart dna gear box cell link globe phone mail pin check` |

---

## 族 H · 流程与图解族（v0.3，规则 R14「一站一拓扑」）

> 核心纪律：**不同语义配不同拓扑**，绝不把同一种流程图复用在不同语义的页面上。
> 流程用链 → 收敛用漏斗 → 迭代用环 → 组合用公式。

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
**与 `StagePipelineChain` 形成语义对照**：流程用链，优化用环。

### `ComboEquationDiagram` 组合公式图
`<ComboEquationDiagram left={{title,items}} right={{title,items}} result={{title,items}} caption />`
「A ＋ B » 产物」三栏公式式布局，每栏 = 胶囊标题 + 药丸堆叠清单。

---

## 族 I · 数据与证据族（v0.3）

> 核心纪律：**图表默认单色**，只有"两组对比"才引入第二色；图注在下、功能标题在右。

### `TargetBarChart` 排序条形图 ★替代饼图
`<TargetBarChart items={[{ label, value, color }]} ticks={5} caption barColor labelWidth="46mm" />`
- **轴在顶部**（与 MCE 一致）+ 右侧对齐的类别标签列 + 单色横条，自动把最大值收成"好看的整刻度"
- `caption` 渲染为**右下角加粗深灰**（MCE 的功能性图注位置）
- 适合：靶点举例 / 参数分布 / 品类计数。单序列排行比饼图更易读。

### `InstrumentReportPanel` 仪器报告面板 ★QC 检测页首选
`<InstrumentReportPanel blocks={[{ label, chart } | { label, columns, rows, total }]} />`
- 浅色标题条 + **图与数据表同框**，容器仅一圈极浅描边
- 表内**无竖线**、表头浅底深灰字、斑马纹、`total` 行带顶线
- 单元格支持 `{ v, rowSpan, colSpan }` 表达纵向合并（如 NO. 列）
- **与 `SpecTable` 的分工**：`SpecTable` = 实底表头的营销参数表；本组件 = 浅底细线的技术数据表。**两种语体按页型选用，不要混**。

### `CitationBlock` 文献引用块
`<CitationBlock title items={[{ journal, text }]} columns={2} icon />`
期刊名加粗深灰 + 卷期页次级灰，CSS 多栏流式（`breakInside: avoid` 防跨栏断行）。
用于**信任页**：用同行评议背书，而不是 logo 墙。

---

## 族 J · 标签与图标列表族（v0.3）

> 核心纪律「同色系自配」：任何彩色元素都是"浅色底 + 同色相深一阶字"，从不跨色相配对。
> 色相由主题主色经 `pastelRamp()` 派生 —— 因此**换主题自动换肤**，组件内不出现任何硬编码色值。

### `CategoryTagRow` 类目胶囊标签行
`<CategoryTagRow items={[]} size="md"|"sm" />`
水平自动换行的圆角胶囊；元素可为字符串或 `{ label, color, fg }`。
用于产品/样本的适用性标记（如 `['mRNA','LNP','GMP 级','标准品']`）。
**规则「类目色恒定」**：同一类目在全册任何页应保持同一色 —— 若要固定，用 `color` 显式指定。

### `ChipPillGrid` 芯片标签网格
`<ChipPillGrid items={[{ label, icon }]} columns={3} />`
浅底圆角芯片 + 行内小图标，2–3 列。用于子能力清单。

### `IconFeatureList` 图标特性列表
`<IconFeatureList items={[{ icon, title, points: [], text, color }]} columns={3} />`
**实心彩圆图标**（白线图标）+ 彩色标题 + 圆点列表。
规则「图标必入容器」：图标从不裸放，容器色即语义色（默认按 `pastelRamp` 轮转）。

---

## 色彩工具（v0.3，供自定义组件派生浅色系）

| 函数 | 说明 |
|---|---|
| `pastelRamp(baseHex, n)` | 从主色派生 n 组 `{ bg, fg, base }` 浅色标签色（低饱和高亮度，色相均匀错开） |
| `mixWhite(hex, amt)` / `mixBlack(hex, amt)` | 与白/黑混合 |
| `shiftHue(hex, deg)` | 色相偏移 |
| `hexToRgb` / `rgbToHex` / `rgbToHsl` / `hslToRgb` | 基础转换 |

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
