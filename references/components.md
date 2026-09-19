# 组件 API · Components（24 个 / 7 族）

> 全部组件从 `src/lib` 导入，自动消费 `ThemeProvider` 注入的主题，**不接收硬编码色值**。

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
