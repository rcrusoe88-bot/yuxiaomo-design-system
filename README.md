# Yuxiaomo Design System · 公司产品服务手册设计系统

> **一套设计语言 × 无限品牌主题。** 为公司产品与服务设计手册时，Agent 参照本系统即可稳定输出——不发散、不产生 AI slop。

**定位**：公司产品手册 / 服务手册 / 产品宣传册，主载体 **A4 印刷页（210×297mm）→ PDF 交付**。Web 落地页为规划中的第二载体。

本系统由三部分构成：**可命名的审美规则**（rules）、**可复用的 React 组件**（components）、**可套用的版式原型**（layouts）。三者与品牌主题令牌解耦，换公司只换主题。系统会持续生长——新增能力的规范见 `references/extending.md`。

## 目录结构

```
yuxiaomo-design-system/
├── SKILL.md                    # ⭐ AI 入口：工作流 + 硬约束 + 反模式 + 扩展速查
├── README.md                   # 本文件：人的入口
├── ROADMAP.md                  # 路线图：已完成 / 待补 / backlog
├── design-language.md          # 设计基因：为什么这样设计
├── references/                 # 被参照的规范（Agent 按需读）
│   ├── rules.md                # 23 条可命名审美规则（R1–R23）
│   ├── tokens.md               # 主题令牌 / 颜色 / 字阶 / 间距
│   ├── taxonomy.md             # ⭐ 组件分类体系（层 × 族）：选组件的入口
│   ├── components.md           # 71 个组件的 API 与用法（14 族）
│   ├── prompt-pack.md          # ⭐ 提示词包（由源码生成）：复制即用的提示词 + 配置代码
│   ├── layouts.md              # 7 个版式原型 + 叙事铁律
│   ├── anti-patterns.md        # AI slop 反模式黑名单
│   ├── checklist.md            # 交付前自检清单
│   └── extending.md            # ⭐ 扩展指南：六类扩展 SOP（X1–X6）+ 完成定义 + 公开红线
├── templates/                  # 整页参考模板（组件是零件，模板是装好的整页）
│   └── README.md               # 模板索引 T01–T07 + 模板规范
├── elements/                   # 设计元素库（可跨主题复用的装饰母题）
│   └── README.md               # 母题登记表 E01–E03 + 元素规范
├── assets/<brand-key>/         # 品牌素材包（logo / photo / chart / brand.md）
│   └── README.md               # 素材规范 + 公开性红线
├── src/
│   ├── lib/                    # 组件库（themes/theme/primitives/titles/text/structure/cards/tables/flow/case/process/topology/data/figures/furniture/tags/icons/color）
│   ├── demo/                   # 演示页：多主题巡展 + 真实文案手册
│   └── styles.css              # 基础样式 + A4 打印规则
├── registry.json               # ⭐ 机器可读契约（由源码生成）：Agent 精确选型入口
├── examples/                   # 出品样例（PDF）
├── scripts/                    # 校验 / 生成 / 运维脚本（audit, verify, density, registry, contract-src, demo-wrap-src, shot-page, contact-sheet, fix-tracking-ref, api-push）
├── shot.cjs / export-pdf.cjs   # 截图 / A4 PDF 导出脚本
└── package.json
```

**两层复用关系**：`src/lib` 是**零件**（组件），`templates/` 是**装好的整页**（先挑模板拼骨架，再换真实文案与品牌素材）。`elements/` 放比组件更小的、与品牌无关的装饰母题。

## 快速开始

```bash
npm install
node node_modules/vite/bin/vite.js --port 5173   # 浏览器预览
node export-pdf.cjs output.pdf                    # 导出 A4 PDF（printBackground + preferCSSPageSize）
node shot.cjs                                     # 逐页截图（visual check，认 .bds-page）
node scripts/shot-page.cjs 5173 "/?app=registry" preview/lab   # 整页截图（工具页，无 .bds-page）
npm run registry                                  # ⭐ 由源码生成 registry.json + 提示词包
```

**改完页面必跑的两条**（A4 骨架的两个坑，都不是 `build` 能发现的）：

```bash
NODE_PATH="<托管 node 工作区>/node_modules" node scripts/verify.cjs 5173   # 溢出？被静默裁掉没有
NODE_PATH="<托管 node 工作区>/node_modules" node scripts/density.cjs 5173  # 密度？半页空白没有
npm run audit                                                              # 文档与代码数对得上没有
```

**要看某个配色状态**（`shot.cjs` / `export-pdf.cjs` 都收 `[path]`，别只截默认页）：

```bash
node shot.cjs 5175 preview "/"                            # 来源模式（每块按自己来源脉取色）
node shot.cjs 5175 preview/qms "/?mce=mce-qms&gs=red"     # 换册：MCE 珊瑚红 + GenScript 红
node shot.cjs 5175 preview/yuantai "/?mode=brand&brand=yuantai"   # 品牌模式：全册远泰红
node export-pdf.cjs examples/out-v0.5.pdf 5175 "/"        # 导出 A4 PDF（可带 path 导换色版）
# 再把三种状态并排成一张图，一眼看出哪一块没跟着换色：
python scripts/contact-sheet.py preview/_cmp.png \
  "来源模式|preview/p05.png" "?mce=mce-qms|preview/qms/p05.png" "品牌模式|preview/yuantai/p05.png"
```

**要"复制提示词"**：`node node_modules/vite/bin/vite.js --port 5175` 后打开 **`/?app=registry`**（组件提示词实验室）。

## 主题一览（`src/lib/themes.js`，10 套 / 3 条脉）

主题按**来源脉**组织。组件不绑定主题，只声明自己属于哪条脉（契约 `src`），由调用方选册 —— 「一套语言 × 多套主题」。

| key | 名称 | 主色 | 深底 | 来源脉 | 对应手册 |
|---|---|---|---|---|---|
| `blue` | 深海蓝 | `#019EDB` | `#006CB1` | GenScript | 核酸服务手册 |
| `red` | 信号红 | `#EE3451` | `#701E20` | GenScript | 细胞工程服务手册 |
| `purple` | 学术紫 | `#682E79` | `#2C1736` | GenScript | 蛋白&抗体服务手册 |
| `wine` | 酒红 | `#EE3250` | `#6F1D1F` | GenScript | 蛋白手册 · 抗体章 |
| `mce-library` | 化合物库深蓝 | `#2C6BAA` | `#2670B8` | MCE | 化合物库手册 |
| `mce-discovery` | 药物发现紫 | `#574DA0` | `#030017` | MCE | 药物发现服务 |
| `mce-protac` | PROTAC 深紫 | `#5A3A7D` | 派生 | MCE | PROTAC 手册 |
| `mce-qms` | QMS 珊瑚红 | `#F16366` | `#120E0F` | MCE | 质量管理体系 |
| `mce-biochem` | 生化试剂青 | `#2995B3` | 派生 | MCE | 生化试剂 |
| `yuantai` | 远泰红 | `#D80000` | `#606060` | 品牌 | 远泰品牌手册（成稿换肤用） |

每套主题含 7 个角色：`functional` / `header` / `dark` / `tint` / `zebra` / `capsuleLight` / `capsuleDeep`，外加 `ramp`（时间轴递变色带）。
**加一家新公司 = 往 `themes.js` 加 8 行。** 加一条**新来源脉**则需要同时登记 `CORPORA` —— 少做这一步，该脉的组件就会静默落到默认蓝（v0.4 的真实事故，见 `references/rules.md` R23）。

**陈列页两种配色视角**（状态存在 URL 里，可分享）：

```
/                                    来源模式（默认）— 每个演示块按自己的来源脉取色
/?mce=mce-qms&gs=red                 把 MCE 侧换成质量管理体系、GenScript 侧换成细胞工程
/?mode=brand&brand=yuantai           品牌模式 — 全册统一换肤，看成稿效果
```

## 组件总览（71 个，14 族）

> **选组件的顺序**：先按 `references/taxonomy.md` 的"层"定位（这页要说哪一层），再回来查签名。
> 层 = 我要说什么（骨架/标题/文本/结构化信息/图形/页眉页脚）；族 = 用什么装。

- **A 结构页**：`Cover` / `SectionDivider` / `IslandBulletGrid` / `BackCover`
- **B 标题**（12）：`PillTitle` / `H2` / `Sub` / `Lead` / `Footnotes` + **v0.4 七形态** `EyebrowTitle` / `PairTitle` / `BlockTitle` / `OutlineTitle` / `BarTitle` / `RuleTitle` / `NumberedTitle`
- **G 页面骨架与图标**：`Page` / `Folio` / `Icon`（16 个面性双色图标）/ `CapsuleDecor`（装饰原语，母题 E01）
- **K 文本**（v0.4，7）：`BodyText` / `BulletList` / `NumberedList` / `DefinitionList` / `NoteBand` / `AnnotationPair` / `FigCaption`
- **C 表格**（6）：`SpecTable` / `TierMatrixTable` / `ProductHeaderRow` / **v0.4** `RowLabelMatrixTable` / `MethodTable` / `KeyValueTable`
- **D 卡片**（7）：`StatCardRow` / `TierCards` / `TestimonialCard` / `ConclusionBanner` / **v0.4** `ProductCardGrid` / `MetricStrip` / `TocList`
- **E 流程**：`FlowChain` / `IconFlowBar` / `TimelineBar` / `ChevronFlow`
- **F 案例证据**：`CaseBlock` / `EvidenceGrid` / `DataChart`
- **H 流程图解**（v0.3）：`StagePipelineChain` / `FunnelStages` / `CycleFlowDiagram` / `ComboEquationDiagram`
- **M 拓扑图**（v0.4，6）：`NumberedStepFlow` / `HexChain` / `BeadChain` / `AnnotatedCycle` / `ServiceNetworkMap` / `PhaseBand`
- **I 数据证据**（v0.3 3 + v0.4 3）：`TargetBarChart` / `InstrumentReportPanel` / `CitationBlock` / `PanelBarChart` / `AnnotatedDonut` / `ScatterClusterPanel`
- **N 图解**（v0.4，3）：`FigurePanel` / `LegendFigure` / `SwatchLegend`
- **J 标签**（v0.3）：`CategoryTagRow` / `ChipPillGrid` / `IconFeatureList`
- **O 页眉页脚**（v0.4，2）：`BrandHeaderBar` / `ContactFooterBand`

> **族 L 刻意留空**：`L` 是版式原型（L1–L7）的编号命名空间，组件族不占用它，避免撞车。

另有色彩工具 `toneRamp` / `categoryRamp` / `pastelRamp` / `mixWhite` / `mixBlack` / `shiftHue`
与文本工具 `renderRich`（行内加粗 = 唯一允许的文本高亮）：让组件从主题令牌**派生**浅色系，而非写死 hex。

## 精确复用：契约 → registry → 提示词包（v0.4.1 / v0.5）

**问题**：Agent 复现一页时读的是**文档**，不是源码。文档一旦与代码脱钩，Agent 就会"照抄一个不存在的属性"。
v0.4.0 交付复核时实测：`references/components.md` 有 **18 个组件**的签名写了源码里根本没有的属性
（`BlockTitle` 的 `text`、`ContactFooterBand` 的 `contacts`、`BrandHeaderBar` 的 `logo`/`pageNo`、
`MethodTable` 的 `columns`、`TocList` 的 `leaders`、`MetricStrip` 的 `highlight` …）。
`npm run build` 完全查不出来 —— 因为**没人拿文档去跑**。这就是"输出质量漂移"的根因。

v0.5 补上第二类漂移：**配色漂移**。属性写错会报错，配色写错**不会** —— 组件照样渲染，只是颜色不对。
所以契约里多了两个字段，专门描述"这个组件本来长什么颜色"：

| 字段 | 取值 | 含义 | 缺了会怎样 |
|---|---|---|---|
| `src` | `genscript` / `mce` / `neutral` | 来源脉（必填） | 下游只能按默认色渲染 → **全部变蓝** |
| `manual` | 主题 key，如 `mce-protac`（可选） | 锁定到具体某一册 | 该组件会被画成"脉里第一册"的色，而非它真实的来源册 |

**解法：把契约放进源码，其余产物全部生成。**

```
src/lib/*.jsx
  └── /* @ds-contract */      ← 唯一真相源。紧贴组件上方，改组件的人一定看得见。
        intent    语义是什么（决定"该不该用它"）
        use       何时用
        notfor    何时【不】用（含该改用哪个组件）—— 防漂移的关键字段
        pairs     常配套的组件
        hue       来源配色（R23：不得统一成蓝色）
        evidence  来源页证据（页码）
        since     版本
        usage     一行可运行用法
              │
              ├── npm run registry ──→  registry.json             机器可读，Agent 选型入口
              │                        references/prompt-pack.md 人的复制粘贴包
              │
              └── npm run audit    ──→  4 条防漂移校验（见下表）
```

**四条机械校验**（都在 `npm run audit`，不一致即退出码 1）：

| # | 查什么 | 为什么必须有 |
|---|---|---|
| 1 | 71 个组件是否都有契约（`intent`/`use`/`notfor`/`usage` 必需） | 缺契约 = 语义靠猜 = 漂移 |
| 2 | `usage` 示例里用到的属性**是否真的存在** | 抓"照抄就错"这一类错误 |
| 3 | `registry.json` / `prompt-pack.md` 是否与源码同步 | 改了源码忘重新生成 = 下游拿到旧契约 |
| 4 | `components.md` 的签名是否与源码一致 | 抓"文档里有、代码里没有"的属性 |

> **铁律重申**：凡写死一个可数事实，必须有脚本能数回来。
> 现在"组件的语义与属性"也成了可数事实 —— 所以它也有了脚本。

**人在浏览器里复制**：`/?app=registry` → 每个组件四个按钮：**复制提示词 / 配置代码 / 源码 / import**。

## 编号命名空间

系统里并存六套编号，**互不通用**——引用时务必带前缀，否则 Agent 会误判指向哪个文件。

| 命名空间 | 含义 | 定义处 | 当前范围 |
|---|---|---|---|
| `R1–R23` | 可命名审美规则 | `references/rules.md` | 23 条 |
| 族 `A–O` | 组件族 | `references/components.md` | 14 族 / 71 组件 |
| `L1–L7` | 版式原型（页面**句型**/骨架） | `references/layouts.md` | 7 个 |
| `T01–T07` | 整页模板（装配好的**成品页**） | `templates/README.md` | 7 个（待补） |
| `E01–E0x` | 设计元素母题 | `elements/README.md` | 3 个（已实现） |
| `X1–X6` | 扩展 SOP 类型 | `references/extending.md` | 6 类 |

> 原型与模板是**多对多**：一个原型可派生多个模板，一个模板必挂一个原型（见 `templates/README.md` 的"对应原型"列）。

## 工具脚本

| 脚本 | 命令 | 作用 |
|---|---|---|
| `scripts/audit.mjs` | `npm run audit` | **一致性校验**：核对文档声明的组件/规则/原型/模板数量与代码实际是否一致；检查组件文档双向覆盖、编号无缺号、命名空间无越界、被引用的文件都存在。不一致退出码 1。 |
| `scripts/api-push.py` | `python scripts/api-push.py <sha>` | **应急推送**：当本机代理把 `github.com` 隧道拦掉（502）、`git push` 不可用时，改用 GitHub Git Data API 原样推送已有提交（完整复刻 author/committer，**生成相同 sha**，不留分叉）。 |
| `scripts/fix-tracking-ref.py` | `python scripts/fix-tracking-ref.py --verify` | **重建 `origin/main` 跟踪引用**。本机 git 写不进这个引用：`git push`/`fetch` 都**报成功**却不落盘，还会把手建的引用**删掉**，于是 `git status` 永远显示 `## main...origin/main [gone]`。→ **每次 push/fetch 之后跑一次**。`--verify` 会先用 `gh api` 核对远端真实 sha 再落盘。 |
| `scripts/verify.cjs` | `npm run verify` | **A4 溢出与运行时校验**：逐页比对 `scrollHeight` vs `clientHeight`。**为什么必须有它**——分页骨架里每页是 `height:297mm; overflow:hidden`，内容超高**不会报错、只会被静默裁掉**，构建通过 ≠ 页面没被裁。同时收集 console 报错与 React 警告。须带 `NODE_PATH` 运行（见文件头注释）。 |
| `scripts/density.cjs` | `npm run density` | **逐页密度校验**：量每页正常流内容占高（**排除 absolute 的页码**，否则每页都量成 96.6%）。`verify` 查"超出"（是错误），`density` 查"没填满"（是质量问题）——一个 A4 页只占 52% 高度时构建通过、无报错、截图也不崩，但印出来就是半页空白。不在 70–93% 区间即提示；**永远退出 0**，不挡构建。 |

| `scripts/registry.mjs` | `npm run registry` | **从源码生成两份可复用产物**：`registry.json`（机器可读契约：语义/禁用/来源配色/真实 props/用法/源码）+ `references/prompt-pack.md`（人的复制粘贴包）。**不要手改这两份产物** —— 它们是 `src/lib/*.jsx` 里 `@ds-contract` 的投影，改源码后重新生成即可。 |
| `scripts/shot-page.cjs` | `node scripts/shot-page.cjs <port> <path> <outPrefix>` | **整页截图（非 A4 页）**：抓工具页 / 提示词实验室（`/?app=registry`）的首屏与整页两张图。`shot.cjs` 只遍历 `.bds-page`，对工具页输出 "A4 pages found: 0"，所以需要这个。 |
| `scripts/contract-src.py` | `python scripts/contract-src.py [--apply]` | **契约 `src` / `manual` 字段的推导与写入**（幂等，可对新增组件重跑）。从 `hue` 文本派生来源脉与锁定册 —— 规则里有一条例外条款很关键：hue 写了「随册/多册/五册/各册」的组件是**跨册复用**，**不许**锁定到某一册（否则把它的通用性丢了）。写完自带字段位置自检。 |
| `scripts/demo-wrap-src.py` | `python scripts/demo-wrap-src.py [--apply]` | **给陈列页的演示单元套 `<SrcBlock>`**（幂等）。演示单元的结构规整（`<RuleTitle>` 引领、到下一个 `<RuleTitle>` 或 `</Page>` 结束），所以可以自动配对；手改 32 处 = 32 次可能打错，而且以后新增演示单元必漏。 |
| `scripts/contact-sheet.py` | `python scripts/contact-sheet.py <out.png> "<label>\|<png>" …` | **配色对比联络表**：把同一页在多个配色状态下的截图**并排成一张图**。本库是「一套语言 × 多套主题」，13 页 × 3 状态 = 39 张图逐张翻是比不出来"哪一块没跟着换色"的。label 里可带 `=`（如 `?mce=mce-qms`），故**用 `\|` 分隔** label 与路径。 |

> `npm run build` 只保证代码能编译，**不保证文档没写错数**——改完文档或加了组件后跑一次 `npm run audit`。

## 如何往里加东西（扩展系统）

系统会持续生长：新主题、新组件、新版式、新模板、新设计元素。完整规范见 **`references/extending.md`**，速查如下。

| 我要加 | 放哪 | 命名 | 完成后必须 |
|---|---|---|---|
| **品牌主题** | `src/lib/themes.js` | key 用品牌小写（`yuantai`） | 补 `references/tokens.md` + 本文件主题表；跑一遍 examples 确认对比度 |
| **React 组件** | `src/lib/<族>.jsx` | PascalCase 语义化 | 导出到 `lib/index.js` + 补 `references/components.md` + demo 里真用一次 |
| **版式原型** | `references/layouts.md` | 顺延 `L8 / L9…` | 写清"何时用 / 由哪些组件构成 / 密度等级"，补进叙事铁律 |
| **整页模板** | `templates/` | `tpl-<场景>-<版式>.html` | 补 `templates/README.md` 索引 + 预览图 |
| **设计元素** | `elements/` | `el-<族>-<名称>.svg` | 补 `elements/README.md` 母题登记表 |
| **参考手册语料** | 本地参考库（仓库外） | — | 逆向出结论后，只把**被验证的规则/组件/令牌**并入系统，原图与原文件不入库 |

四条铁律：

1. **只加不改语义** —— 改动既有组件/令牌的语义属破坏性变更，要记变更说明并检查所有样例。
2. **可见性 = 登记** —— 没进索引的产出，对 Agent 等于不存在。
3. **可复用优先于能用** —— 只服务一页的东西叫页面内容，不叫组件。
4. **有证据** —— 新规则必须写清来源（页码 / 项目名），不接受"我觉得好看"。

> **公开仓库红线**：本仓库是 public。保密素材（未公开产品数据、内部实验图、第三方手册原图）不入库，放本地 `assets-local/`（已 gitignore）。详见 `references/extending.md` 第三节。

## 设计来源

**第一批 · GenScript（金斯瑞）**三份产品手册共 44 页 —— 逐页视觉逆向 + 像素级色值实测，产出 R1–R13、族 A–G。经真实项目（远泰生物 mRNA-LNP 手册）迭代校准。

**第二批 · MCE（MedChemExpress 皓元）**五份手册共 145 页 —— 文字层字号普查 + 表格结构检出 + 矢量/位图密度扫描 + 46 页逐页视觉读取，产出 R14–R21、族 H–J（10 个新组件）。这一批补上了本系统原本的短板：**流程拓扑的语义分工、技术数据的呈现语体、服务型手册的信任与转化结构**。

**第三批 · 同一批 MCE 语料的 11 页版式细读（v0.4）** —— 把 11 张关键页截图逐页拆解"标题块 / 表格 / 文本块 / 流程图"的**形态谱系**，产出 **34 个新组件**（族 K / M / N / O + 族 B/C/D/I 扩展）、**R22 类目色纪律**，以及按"层 × 族"重排的 `references/taxonomy.md`。
这一批解决的是**组件太少**的问题：v0.3 只有 37 个组件时，遇到"编号步骤""并列条件""多入口汇聚""时间轴位置"这类语义只能硬套现有拓扑，导致语义漂移；补齐到 71 个之后，每种语义都有专属形态可用。

**第四批 · 组件代码化 + 提示词化（v0.4.1）** —— 给 71 个组件补上源码内的语义契约（`@ds-contract`），
并生成 `registry.json` 与 `references/prompt-pack.md`；同时新增 **R23 配色随来源，不随默认**（组件保持其来源手册的色相，
不得把不同来源的组件统一成蓝色 —— 五册实测色相本就各不相同：library 深蓝 `#2C6BAA` / PROTAC 深紫 `#5A3A7D` /
qms 珊瑚红 `#F16366` / 生化试剂 青 `#2995B3` / 药物发现 紫 `#574DA0`）。
这一批修掉了 18 个组件的文档签名漂移，并新增 4 条机械校验把漂移变成退出码。

**第五批 · 让组件回到它本来的颜色（v0.5）** —— 把 R23 从一条"愿望"变成可校验的结构。
起因：陈列页 13 页**全部渲染成 `#019EDB`**。但根因不是"忘了换主题"，而是 **`themes.js` 当时只实现了 GenScript 一条来源脉**，
而 36 个组件在契约里声明自己源自 MCE 五册 —— 它们的来源色在系统里**根本不存在**，只能落到默认蓝。
`npm run build` 通过、`audit` 通过，全都查不出来，因为没有任何检查会去对撞"声明的脉"与"存在的主题"。

这一批做了三件事：① 补齐 **5 套 MCE 来源主题**（实测值取样，缺失角色由 `derived()` 派生）；
② 契约新增 `src`（来源脉）与 `manual`（锁定册）两个机器可读字段，`npm run registry` 会拒收缺 `src` 或脉册不符的组件；
③ `audit` 新增「来源脉闭环」检查，陈列页改成**来源模式**（每个演示块按自己的脉取色，标「锁定」的由契约钉死）
+ **品牌模式**（全册统一换肤）。

完整逆向报告：`行业参考手册库/GenScript_金斯瑞/设计元素完整清单_GenScript.md`、`行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md`。
方法可复用：《手册设计元素提炼提示词.md》。

## 许可

MIT（见 LICENSE）。参考手册的版式语言属公开可观察的设计事实；本仓库代码与文档为原创实现。
