// Brochure Design System —— 公开 API
//
// 分类体系（层 × 族）见 references/taxonomy.md：
//   骨架 → 标题 → 文本 → 表格 / 卡片 → 图形（拓扑·图表·图解）→ 标签 → 页眉页脚
// 本文件按"族"分组导出，一族一个源文件；族字母不占用 L（L1–L7 是版式原型）。
export { THEMES, NEUTRAL, getTheme } from './themes'
export { ThemeProvider, useTheme, useNeutral } from './theme'

// —— 族 A 结构页（唯一允许满版深底）
export { Cover, SectionDivider, IslandBulletGrid, BackCover } from './structure'

// —— 族 B 标题族：基础 5 态（primitives）+ v0.4 形态变体 7 种（titles）
export { PillTitle, H2, Sub, Lead, Footnotes } from './primitives'
export { EyebrowTitle, PairTitle, BlockTitle, OutlineTitle, BarTitle, RuleTitle, NumberedTitle } from './titles'

// —— 族 G 页面骨架与图标（Page 是每页的根容器；CapsuleDecor 是装饰原语）
export { Page, Folio, CapsuleDecor } from './primitives'

// —— 族 K 文本族（v0.4 新增）
export { FigCaption, BodyText, BulletList, NumberedList, DefinitionList, NoteBand, AnnotationPair } from './text'

// —— 族 C 表格族：C1–C3 营销语体 + C4–C6 选型/知识/信息语体
export { SpecTable, TierMatrixTable, ProductHeaderRow } from './tables'
export { RowLabelMatrixTable, MethodTable, KeyValueTable } from './tables'

// —— 族 D 卡片族：D1–D4 + D5–D7（v0.4）
export { StatCardRow, TierCards, ConclusionBanner, TestimonialCard } from './cards'
export { ProductCardGrid, MetricStrip, TocList } from './cards'

// —— 族 E 流程族（底座）
export { FlowChain, IconFlowBar, TimelineBar, ChevronFlow } from './flow'

// —— 族 F 案例与证据族
export { CaseBlock, EvidenceGrid, DataChart } from './case'

// —— 族 H 流程与图解族（v0.3）
export { StagePipelineChain, FunnelStages, CycleFlowDiagram, ComboEquationDiagram } from './process'

// —— 族 M 拓扑图族（v0.4 新增）：语义 → 拓扑一一绑定，见 topology.jsx 头部对照表
export { NumberedStepFlow, HexChain, BeadChain, AnnotatedCycle, ServiceNetworkMap, PhaseBand } from './topology'

// —— 族 I 数据与证据族：I1–I3（v0.3）+ I4–I6（v0.4）
export { TargetBarChart, InstrumentReportPanel, CitationBlock } from './data'
export { PanelBarChart, AnnotatedDonut, ScatterClusterPanel } from './data'

// —— 族 N 图解族（v0.4 新增）：装框 / 配色块 / 排图例
export { FigurePanel, LegendFigure, SwatchLegend } from './figures'

// —— 族 J 标签族（v0.3）
export { CategoryTagRow, ChipPillGrid, IconFeatureList } from './tags'

// —— 族 O 页眉页脚（v0.4 新增）：注意 @page 无 margin box，须画在 .page 内部
export { BrandHeaderBar, ContactFooterBand } from './furniture'

// —— 图标
export { Icon, ICON_NAMES } from './icons'

// —— 工具函数（非组件，audit 计数时排除；单行写法便于 audit 逐行解析）
export { pastelRamp, toneRamp, categoryRamp, mixWhite, mixBlack, shiftHue, hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './color'
export { renderRich } from './text'
