# CHANGELOG

遵循「只加不改语义」（additive-first）：新增能力升**次版本**；修改既有组件 / 令牌的语义或默认值属破坏性变更，必须在此记明并检查 `examples/` 全部样例是否仍成立。

## v0.4.1 — 2026-09-19

**主题：把组件"代码化 + 提示词化" —— 让精确复用不靠自觉，靠校验**

起因：v0.4.0 交付复核时发现，`references/components.md`（Agent 用来查签名的文件）有 **18 个组件**写了源码里
根本不存在的属性 —— `BlockTitle` 的 `text`、`ContactFooterBand` 的 `contacts`、`BrandHeaderBar` 的
`logo`/`en`/`pageNo`、`MethodTable` 的 `columns`、`TocList` 的 `leaders`、`MetricStrip` 的 `highlight`、
`AnnotationPair` 的 `left`/`right`/`ratio`、`FigurePanel` 的 `en`/`notes`/`height`、
`LegendFigure` 的 `center`/`height`、`RowLabelMatrixTable` 的 `headerImage`/`caption`、
`KeyValueTable` 的 `caption`、`DefinitionList` 的 `divided`、`BeadChain` 的 `items`、
`SwatchLegend` 的 `columns`/`caption`、`ScatterClusterPanel` 的 `axes`/`n`、
`EyebrowTitle` 的 `cn`/`en`/`size`、`BarTitle`/`RuleTitle` 的 `cn`、`NumberedTitle` 的 `no`/`text`、
`OutlineTitle` 的 `text`、`CategoryTagRow` 的 `palette`。
`npm run build` 查不出这类错误（没人拿文档去跑），而 Agent 照文档写就会**静默渲染出空白**。

**新增：组件契约层（源码内单一真相源）**

- 71 个组件各加一块 `/* @ds-contract */`，紧贴 `export function` 上方，字段：
  `intent` / `use` / `notfor` / `pairs` / **`hue`（来源配色）** / `evidence` / `since` / `usage`。
- 为什么放源码而不是另建表：契约与实现只隔 5 行，改组件的人一定看得见；另存一张表则必然漂移（本次就是）。

**新增：`scripts/registry.mjs`（`npm run registry`）**

从源码生成两份产物（**投影，不手写**）：
- `registry.json` —— 机器可读：语义 / 禁用 / 来源配色 / 真实 props（含默认值）/ 可运行用法 / 源码片段 / 成稿提示词。
- `references/prompt-pack.md` —— 人的复制粘贴包，按族编排，每组件含「提示词 + 配置代码 + 源码」。

**新增：提示词实验室 UI（`/?app=registry`）**

参照 reactbits.dev 的「Copy for AI」四件套：每个组件四个按钮 —— 复制提示词 / 配置代码 / 源码 / import；
按族筛选 + 全文搜索；每卡显示**来源配色色块**。

**提示词实验室：来源配色必须画全（否则 UI 自己就在违反 R23）**

色块最初只取 `hue` 里的**第一个** hex。但 71 个组件里 **40 个**的 hue 天然是多色相的，形如
`GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）` —— 只画第一个等于把它们
**全部显示成蓝色**，正好就是 R23 明令禁止的"统一成默认蓝"。现改为：

- 取**全部** hex 逐个画色块（40 个三色 / 13 个双色组件现在显示完整）；
- 摘掉色值后的文字（`hueLabel()`）作为"出处"显示，如 `GenScript 三册 · 随主题`；
- 无 hex 的 6 个组件（`BlockTitle` / `PhaseBand` / `MetricStrip` 等）画**斜纹占位块**而非灰色实心
  —— 灰色实心会被误读成"它的来源色就是灰的"。

**修正**

- `components.md` 的 18 处签名漂移全部按源码改正（并立检查防复发）。
- `taxonomy.md` 的 `palette` 组件清单误列了 `CategoryTagRow`（它没有 `palette` 参数，类目色靠 per-item `color`）。
- `AnnotatedDonut` 的示例误用了不存在的 `value`（该组件各扇区**均分**，弧长不代表数值）；`ScatterClusterPanel` 的
  `clusters` 需 `{x,y,r}` 而非 `{label,color}` —— 两处示例已按源码修正。
- `scripts/verify.cjs` 增加 `[path]` 参数与"无 A4 骨架时的渲染兜底"：工具页若因 JSON 导入失败而整页空白，
  以前会被判为"0 页溢出 = 通过"，现在会报错。（该兜底当次就抓到提示词实验室的一个变量未定义导致整页空白。）
- 新增 `scripts/shot-page.cjs`：抓取**非** A4 分页页面的整页截图（`shot.cjs` 只认 `.bds-page`，对工具页输出 0 页）。

**新增 1 条规则（R23 配色随来源，不随默认）**

组件复用时颜色由**其来源手册的色相**或**调用页主题**决定；禁止把不同来源的组件统一成同一种颜色（尤其默认蓝）。
MCE 五册实测色相本就各不相同（library 深蓝 `#2C6BAA` / PROTAC 深紫 `#5A3A7D` / qms 珊瑚红 `#F16366` /
生化试剂 青 `#2995B3` / 药物发现 紫 `#574DA0`）。

**新增 4 条机械校验（都在 `npm run audit`）**

1. 71 个组件是否都有契约（4 个必需字段齐全）；2. `usage` 示例里的属性是否真的存在；
3. 生成物是否与源码同步（改了源码忘重新生成 = 下游拿到旧契约）；4. `components.md` 签名是否与源码一致。

**修正**

- `components.md` 的 18 处签名漂移全部按源码改正（并立检查防复发）。
- `taxonomy.md` 的 `palette` 组件清单误列了 `CategoryTagRow`（它没有 `palette` 参数，类目色靠 per-item `color`）。
- `AnnotatedDonut` 的示例误用了不存在的 `value`（该组件各扇区**均分**，弧长不代表数值）；`ScatterClusterPanel` 的
  `clusters` 需 `{x,y,r}` 而非 `{label,color}` —— 两处示例已按源码修正。
- `scripts/verify.cjs` 增加 `[path]` 参数与"无 A4 骨架时的渲染兜底"：工具页若因 JSON 导入失败而整页空白，
  以前会被判为"0 页溢出 = 通过"，现在会报错。

## v0.4.0 — 2026-09-19

**主题：把组件从 37 补到 71 —— 按「层 × 族」系统性补全组件库**

起因是一次交付复核：用 v0.3 做真实手册时发现**组件太少**，遇到"编号步骤""并列条件""多入口汇聚""时间轴位置""多产品矩阵"这类语义时，只能硬套现有拓扑或手写一次性样式，导致**语义漂移**（把迭代画成链、把并列画成流程）。本版按 11 张 MCE 关键页的形态谱系，把每一层的空缺补上。

**新增 34 个组件（其中 3 个新族）**

| 族 | 新增 | 组件 |
|---|---|---|
| **B 标题**（+7） | 标题形态变体 | `EyebrowTitle` `PairTitle` `BlockTitle` `OutlineTitle` `BarTitle` `RuleTitle` `NumberedTitle` |
| **K 文本**（新族，7） | 补齐占比最大的内容层 | `BodyText` `BulletList` `NumberedList` `DefinitionList` `NoteBand` `AnnotationPair` `FigCaption` |
| **C 表格**（+3） | 补选型 / 方法 / 属性三种语体 | `RowLabelMatrixTable` `MethodTable` `KeyValueTable` |
| **D 卡片**（+3） | 产品卡 / 指标条 / 目录 | `ProductCardGrid` `MetricStrip` `TocList` |
| **M 拓扑**（新族，6） | 补 3 种表达不了的语义 | `NumberedStepFlow` `HexChain` `BeadChain` `AnnotatedCycle` `ServiceNetworkMap` `PhaseBand` |
| **I 数据**（+3） | 小倍数 / 构成 / 分布 | `PanelBarChart` `AnnotatedDonut` `ScatterClusterPanel` |
| **N 图解**（新族，3） | 给图装统一外壳 | `FigurePanel` `LegendFigure` `SwatchLegend` |
| **O 页眉页脚**（新族，2） | 内页品牌条与联系带 | `BrandHeaderBar` `ContactFooterBand` |

**新增 1 条规则（R22 类目色纪律）**

组件一旦支持"多档配色"，默认值选错就会让整册变花。故立 R22：**多档配色默认同色相**（`palette="tone"` / `toneRamp`）；只有颜色本身承载类目含义时才允许跨色相（`palette="category"`），且必须经 R21 全册锁定。
为此 `color.js` 新增语义化别名 `toneRamp` / `categoryRamp`（`pastelRamp` 保留为通用入口，v0.3 旧签名默认跨色相，兼容）。**所有多档配色组件（`HexChain` / `ProductCardGrid` / `NumberedStepFlow` / `CategoryTagRow` …）默认值统一为同色相。**

**新增分类体系 `references/taxonomy.md`**

v0.3 的组件只能"按族查签名"（作者视角），但设计一页的真实顺序是自上而下的"这页要说哪一层"。
新文件按 **层（骨架 → 标题 → 文本 → 结构化信息 → 图形 → 页眉页脚）× 族** 重排，并给出：
- 12 种标题形态的**语义分工表**（形态必须跟语义绑定，不许"好看就用"）
- 层 5 的**语义 → 拓扑对照表**（R14 的落地判据：你要表达的是哪种关系？）
- `palette` 参数的**选择判据**（R22）

**族 L 刻意留空**：`L1–L7` 是版式原型的命名空间，组件族不占用，避免 v0.3.1 修过的"命名空间撞车"复发。

**新增校验工具 `scripts/verify.cjs`**

`npm run verify` —— 逐页比对 `scrollHeight` vs `clientHeight`。
**为什么必须是独立一步**：分页骨架里每页 `height:297mm; overflow:hidden`，**内容超高不报错、只被静默裁掉**，`npm run build` 通过 ≠ 页面没被裁。
本版末次运行：13 页全部"无溢出、零报错"。
（Playwright 只装在托管 node 工作区，须 `.cjs + require` + `NODE_PATH` 运行——ESM 的 `import` 不认 `NODE_PATH`。）

**新增示例 `src/demo/AppTaxonomy.jsx`**

12 个内容页 + 封面，按分类体系的"层序"逐层陈列 34 个新组件，内容用远泰 mRNA-LNP 场景（数字均为示例）。
逐页密度实测：**75.6%–89.9%**（封面满版不计），无一行溢出。

**本版修掉的问题（均为"只有渲染出来才看得见"的类型）**

- `ServiceNetworkMap` 首个 demo 语义不成立：只放了 4 个节点 + 2 条注解，既没做出"多入口汇聚再分出"的网络结构，还留了一支**悬空箭头**（`arrow:'down'` 下方没有节点）→ 重写为 3 入口 → 1 中枢（独占整行、跨满 3 列）→ 3 出口 → 3 交付注解，并加"配比纪律"说明。
- 该页因此**只占 52.4% 高度**（页面近半空白）→ 补入「六种拓扑的选择速查」表（`KeyValueTable`），既填满又给拓扑章一个收束 → 84%+。
- 文本层页（`p03`）密度仅 62.4% → 补第二段正文（含 CQA / CPP / 设计空间论述）与列表条目 → 75.6%。
- 拆页重编号后**页眉眉标整体错位一页**（`Page9` 眉标仍写 `P8`，一路错到 `P12` 写 `P11`），`Page7` 页题仍写着已移到别页的"网络"→ 逐条改正。
  *教训：页号与眉标是两套编号，拆页时必须一起改；光看代码不渲染发现不了。*

**文档同步**

`components.md`（37→71 个 / 10→14 族，34 个新条目全部登记）、`README.md`、`SKILL.md`、`rules.md`（R1–R22）、`checklist.md`（新增 J 节 9 条 v0.4 专项）、`ROADMAP.md`。`npm run audit` 全绿。

## v0.3.1 — 2026-09-19

**主题：修文档漂移（doc drift）——不碰任何组件代码**

推送 v0.3 后做交付复核，发现文档声称的数字与代码实际长期不符，且存在三处编号命名空间互相撞车。**这类错误不会让构建失败，但会让 Agent 用错组件**，故单独立一版修掉，并加自动校验防复发。

**勘误（历史记录一并改，不掩盖）**

- **组件计数一直偏低**：v0.1 写「24 个组件」，实际导出 **27 个**（`src/lib/index.js` 逐个点数）；v0.3 写「34 个」，实际 **37 个**。错因是计数时按"族内列举"人工累加漏计（`Sub`/`Lead`/`Footnotes`/`CapsuleDecor` 等），且这个偏低的基数从 v0.1 一路传了三个版本。
- **规则数未同步**：`SKILL.md` 描述与第 4 步仍写「13 条审美规则」，实际自 v0.3 起为 **21 条**（R1–R21）。
- **`CapsuleDecor` 从未登记**：它被 `Cover` / `BackCover` / `SectionDivider` 内部调用，在 `references/components.md` 里缺条目，导致"导出数"与"文档数"天然对不上。
- `README.md` 组件总览把 `Footnotes` 放进族 G，与 `components.md`（族 B）不一致 → 统一到族 B。
- `ROADMAP.md` 出现两个 `## v0.4` 章节 → 后一个改为 `v0.5`。

**命名空间去撞车（此前三套编号互相踩）**

| 命名空间 | 现状 | 问题 | 处置 |
|---|---|---|---|
| 审美规则 | `R1–R21` | 无 | 保持 |
| 组件族 | 族 `A–J` | 无 | 保持 |
| **版式原型** | `layouts.md` 用 `T1–T7`；`extending.md` 与 `templates/README.md` 却按 `L1–L8` 引用 | 与"整页模板 `T01–T07`"同名 T | **统一为 `L1–L7`**（跟多数派，两处已按 L 写） |
| **整页模板** | `T01–T07` | 同上 | 保持 |
| **设计元素母题** | `E01–E03` | 与 `extending.md` 的扩展类型 `E1–E6` 同名 E | 母题保持 `E01–` |
| **扩展 SOP 类型** | 原 `E1–E6` | 同上；且 `extending.md` 的"四条铁律"另用 `L1–L4`，又撞原型 L | **扩展类型改 `X1–X6`**；铁律去掉字母前缀，改称「铁律 1–4」 |

- `templates/README.md` 的"对应原型"列按 `layouts.md` 自身"组件骨架"列逐条重新对齐（T01→L1 / T02→L3 / T03、T04→L5 / T05、T06→L6 / T07→L7），并标出 **L2 目录型、L4 卖点页型当前无模板** 的缺口。
- `SKILL.md` 与 `README.md` 新增「编号命名空间」对照表，明确六套编号互不通用。

**反模式条目按 R16 修正**

- `SKILL.md` 原写「表头用浅色底深字（应实底白字）」——R16 确立"两种表格语体"后此条只对**营销参数表**成立，对**技术数据表**（`InstrumentReportPanel`，浅底细线表头）恰好相反。已改为按页型分列，并新增一条「同一语义全册复用同一种图（违反 R14）」的反模式。

**新增工具**

- `scripts/audit.mjs`（`npm run audit`）：校验①代码导出 ↔ 组件文档双向覆盖；②文档声明的组件/规则/原型/模板数量与代码实际一致；③规则与原型编号无缺号；④命名空间无越界（原型文件里不得出现模板 T 编号等）；⑤文档引用的文件都存在。**不一致即退出码 1**，可直接挂进提交前钩子。
- 首次运行即抓出 1 处告警（`layouts.md` 的 `T01–T07` 提及属合法命名空间声明）→ 收窄为"行内同时提到'模板'则豁免"，复跑全绿。

**未变**

- `src/lib/` 全部组件代码、令牌、主题、`examples/` 样例输出**零改动**（本版纯文档 + 新工具）。

## v0.3.0 — 2026-09-19

**第二批参考语料：MCE（MedChemExpress 皓元）五册 145 页逆向**

- 逆向对象：化合物库手册 92p / 药物发现服务 8p / PROTAC 19p / 质量管理体系 24p / 生化试剂 2p。
- 方法：文字层字号普查 + 表格结构检出 + 矢量/位图密度扫描 + 46 页逐页视觉读取 + 7 页矢量层导出 SVG 校验。
- 逆向报告：`行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md`（含 5 处与现有系统的冲突判定）。

**新增 3 个组件族 / 10 个组件（纯新增，未改动任何既有组件语义）**

- 族 H 流程图解：`StagePipelineChain` / `FunnelStages` / `CycleFlowDiagram` / `ComboEquationDiagram`
- 族 I 数据证据：`TargetBarChart` / `InstrumentReportPanel` / `CitationBlock`
- 族 J 标签：`CategoryTagRow` / `ChipPillGrid` / `IconFeatureList`
- 新增 `src/lib/color.js`：`pastelRamp` / `mixWhite` / `mixBlack` / `shiftHue` / 色彩转换工具，使组件从主题令牌**派生**浅色系而非写死 hex。

**新增 8 条可命名规则（R14–R21）**

一站一拓扑 / 深浅=顺序色相=并列 / 两种表格语体按页型选用 / 图标必入容器 / 量化承诺内联加粗 / 信任靠同行评议 / 深色收尾转化 / 类目色恒定。

**修复**

- `styles.css`：末页 `break-after: page` 导致导出 PDF 多出一张空白页 → 加 `.bds-page:last-of-type { break-after: auto }`；并新增 `.bds-demo-wrap` 打印归零规则。
- `shot.cjs` / `export-pdf.cjs`：端口写死 5173 导致换端口即失败 → 改为可传入端口参数（`node shot.cjs 5175`）。
- 族编号冲突：新族曾用 P/D/T，与既有「族 D 卡片」撞名 → 改为 H/I/J。

**新增示例**

- `src/demo/AppComponents.jsx`：6 页 A4 组件陈列（远泰 mRNA-LNP 场景），产出 `examples/components-v0.3.pdf`（6 页 595×842 pt，零运行时错误）。

## v0.2.0 — 2026-09-19

**定位收紧**
- 从"个人产品页设计系统"收紧为**公司产品服务手册设计系统**，主载体明确为 A4 印刷页（210×297mm）→ PDF；Web 落地页降级为规划中的第二载体。

**新增（扩展骨架）**
- `references/extending.md`：六类扩展 SOP（X1–X6）（品牌主题 / React 组件 / 版式原型 / 参考模板 / 设计元素）+ 四条铁律 + 完成定义（DoD）+ 公开仓库素材红线。
- `templates/README.md`：整页模板索引 T01–T07 + 模板规范 + "什么时候才值得新增模板"。
- `elements/README.md`：设计元素母题登记表 E01–E03 + 元素规范 + 新增元素三问。
- `assets/README.md`：品牌素材包目录规范 + 公开性红线 + 禁止杜撰品牌资产。
- `ROADMAP.md`：v0.1–v0.4 路线图与 backlog。
- `CHANGELOG.md`：本文件。
- `.gitignore` 增加 `assets-local/`（保密素材本地存放，不入库）。

**变更**
- `package.json`：包名 `brochure-design-system` → `yuxiaomo-design-system`，版本 `0.1.0` → `0.2.0`，补 `shot` / `pdf` 脚本与描述。
- `README.md`：更新定位、目录结构（新增 templates / elements / assets / ROADMAP）、新增"如何往里加东西"一节。
- `SKILL.md`：更新 frontmatter 描述与定位，新增"扩展这套系统"速查表。

**未变**
- `src/lib/` 组件与令牌、`references/` 其余六份规范、`examples/` 样例均未改动语义。

## v0.1.0 — 2026-09-19

- 首个版本：13 条可命名审美规则、5 套品牌主题、**27 个组件**（当时记为 24，v0.3.1 勘误）、7 个版式原型、AI slop 六类反模式、A4 打印链路、双主题 A4 样例。
- 来源：GenScript（金斯瑞）三份产品手册共 44 页的逐页视觉逆向 + 像素级色值实测，经真实项目（远泰生物 mRNA-LNP 手册）迭代校准。
