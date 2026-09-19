# ROADMAP · 路线图

> 原则：**先用真实项目跑一遍，暴露真实缺口，再补能力。** 不拍脑袋造模板。

## v0.1 — 系统成型（2026-09-19）

- [x] 13 条可命名审美规则（带页码证据，v0.3 扩到 21 条）
- [x] 5 套品牌主题令牌（blue / red / purple / wine / yuantai）
- [x] 27 个 React 组件（7 族）+ 16 个面性双色图标（v0.3 实测：初版计数漏 3 个，实为 27）
- [x] 7 个版式原型 + 叙事铁律 + 密度节奏
- [x] AI slop 六类反模式黑名单
- [x] A4 打印链路（Playwright → PDF）+ 交付自检清单
- [x] 双主题 A4 样例（`examples/`）

## v0.2 — 扩展骨架

- [x] 扩展指南 `references/extending.md`（六类扩展 SOP X1–X6 + 完成定义 + 公开红线）
- [x] `templates/` 整页模板索引（T01–T07 待补）
- [x] `elements/` 设计元素母题登记（E01–E03 已实现）
- [x] `assets/` 品牌素材包规范
- [ ] **好坏样例对照** `examples/good-vs-bad.md`（同内容并排：系统产出 vs 典型 AI slop）——防 slop 最直接的一课
- [ ] 首个真实模板落地（建议从 T04 服务档位页开始）

## v0.3 — 第二批语料：MCE 五册逆向（已完成）

- [x] 逆向 MCE 五册 145 页，产出 `设计元素完整清单_MCE.md`（含 5 处冲突判定）
- [x] 新增 3 族 / 10 个组件：`StagePipelineChain` `FunnelStages` `CycleFlowDiagram` `ComboEquationDiagram` / `TargetBarChart` `InstrumentReportPanel` `CitationBlock` / `CategoryTagRow` `ChipPillGrid` `IconFeatureList`
- [x] 新增 `color.js` 色彩派生工具（`pastelRamp` 等）
- [x] 新增规则 R14–R21
- [x] 6 页 A4 组件陈列 + `examples/components-v0.3.pdf`
- [x] `scripts/audit.mjs` 一致性校验（`npm run audit`）：组件/规则/原型/模板计数与命名空间越界，文档与代码不一致即退出码 1
- [x] doc-drift 修复：组件计数 24/34 → 实际 **37**；规则 13 → **21**；命名空间去撞车（原型 `T1–T7` → `L1–L7`、扩展类型 `E` → `X`、铁律去 `L` 前缀、元素母题保留 `E01–`）
- [x] 实现队列 **P1**（部分，v0.4 完成）：`RowLabelMatrixTable` ✅ / `BrandHeaderBar` ✅ / `ContactFooterBand` ✅ / `TocList`（等价于 `DotLeaderIndex`）✅ / `GhostPairTitle` ⬜（仍待决策）
- [ ] 实现队列 **P2**（v0.4 未做，顺延）：`CompareMatrixTable` / `CodedProductGrid` / `StatCompareCard` / `CategoryIconGrid` / `GelEvidencePanel` / `MediaCoverGrid` / `PathwayFigureCard` / `InstrumentPhotoGrid` / `FunnelBand` / `FeatureBulletList`
- [ ] 实现队列 **P3**（v0.4 未做，顺延）：`TableOfContentsBand` / `SeriesListTable` / `ChartPanel` / `StructureGallery` / `DonutChartPanel` / `NumberedPlatformFigure` / `CircleBadge` / `Cover` 遮罩变体
- [ ] **待你决策的两项**：① 英文幽灵标题是否纳入默认标题体系（v0.4 给了 `PairTitle` 作中英对照默认，幽灵叠压版仍搁置）；② 分子彩纸母题是否作为第 4 母题加入（当前决定：不加入）

## v0.4 — 组件库系统性补全（已完成，2026-09-19）

> 触发原因：用 v0.3（37 个组件）做真实手册时，多种语义**找不到对应形态**，只能硬套或手写一次性样式。

- [x] 按「层 × 族」补全组件库：**37 → 71 个组件**（14 族，其中 K / M / N / O 为新族）
- [x] 标题形态从 3 种补到 **12 种**，并立"形态跟语义绑定"的纪律（H1 一页一个、全册 H2 只用一种）
- [x] 文本层建族 K（7 个）：此前只有 `Lead` / `Sub` / `Footnotes`，而文本是占比最大的内容层
- [x] 拓扑从 4 种补到 **10 种**：新增 `NumberedStepFlow` / `HexChain` / `BeadChain` / `AnnotatedCycle` / `ServiceNetworkMap` / `PhaseBand`
- [x] 新增规则 **R22 类目色纪律** + `toneRamp` / `categoryRamp` 语义化别名
- [x] **组件契约层**：71 个组件加 `@ds-contract`（语义 / 禁用 / 来源配色 / 用法）
- [x] **生成物**：`scripts/registry.mjs` → `registry.json` + `references/prompt-pack.md`
- [x] **提示词实验室**（`/?app=registry`）：复制提示词 / 配置代码 / 源码 / import
- [x] 新增规则 **R23 配色随来源，不随默认**（组件保持来源手册色相，不得统一成蓝）
- [x] `audit` 增加 4 条防漂移校验（契约覆盖 / usage 属性 / 生成物新鲜度 / 文档签名漂移）
- [x] 新增 `references/taxonomy.md`：按"层"选组件的入口（含语义→拓扑对照表）
- [x] 新增 `scripts/verify.cjs`（`npm run verify`）：把"静默裁切"变成退出码
- [x] 12 页组件陈列 Demo + 逐页密度实测（75.6%–89.9%，无溢出）
- [x] 文档全量同步（components / README / SKILL / rules / checklist），`npm run audit` 全绿
- [ ] **仍未做**：`examples/components-v0.4.pdf` 之外的样例更新；族 K/M/N/O 的真实项目验证（下一个真实手册项目里跑）

## v0.5 — 来源脉补全（已完成，2026-09-19）

> 触发原因：你看到 v0.4 的「组件模板」13 页**全是同一种蓝**，要求"组件保留原有的风格及配色"。
> 排查结论：不是忘了换主题，而是 `themes.js` 只实现了 GenScript 一条脉，
> MCE 五册的 36 个组件**在系统里根本没有色可取** —— 只能落到默认 blue。

- [x] **补齐第二条来源脉**：`themes.js` 新增 5 套 MCE 主题（`mce-library` `#2C6BAA` /
      `mce-discovery` `#574DA0` / `mce-protac` `#5A3A7D` / `mce-qms` `#F16366` / `mce-biochem` `#2995B3`），
      实测值取自 MCE 逆向清单第〇节，未覆盖的角色走 `derived(f)` 统一派生（不手工编 hex）
- [x] **`CORPORA` 来源脉索引**：脉 → 册 → 主题 key 的单一真相源，`registry` / `audit` 直接 import
- [x] **契约新增 `src`（来源脉，必填）+ `manual`（锁定册，可选）**：71 个组件全补齐
      （genscript 28 / mce 35 / neutral 8；16 个锁定到具体册）
- [x] **`audit` 新增「来源脉闭环」**：每条脉的每一册必须有主题、`theme.corpus` 必须回指、
      `manual` 必须与 `src` 同脉 —— **这条检查在 v0.4 会当场报错**
- [x] **陈列页拆两种配色视角**：来源模式（每块按自己脉取色 + 徽标显示「脉·册·hex」，锁定的标「锁定」）
      与品牌模式（全册统一换肤）；状态写入 URL 可分享复现
- [x] `src` / `manual` 进入 `prompt-pack.md` 与 `registry.json`，并新增「组件来源脉」总表
- [x] 文档同步（tokens / rules / checklist / README / SKILL）+ `npm run audit` 全绿
- [x] `shot.cjs` / `export-pdf.cjs` 支持指定配色状态路径（原来写死 `/`，无法导出换色版本）

- [x] 重出样例 PDF：`examples/components-v0.5-source.pdf`（来源模式，每块各自取色）
      与 `examples/components-v0.5-brand-yuantai.pdf`（品牌模式，全册远泰红）—— 13 页无尾页
- [ ] **仍未做**：`accent`（MCE 第二色）仍未接进组件 —— 受 R1（一册一色相）压制，这是**有意的**，不是漏做

## v0.6 — 按真实项目补齐

- [ ] 用本系统完整做一版公司手册，记录"哪一页找不到对应原型 / 组件"
- [ ] 按缺口补 T01–T07 模板与 E04+ 元素
  - **优先补 L4 卖点页型模板（T08）与 L2 目录型模板（T09）**——L1–L7 里目前只有这两个原型没有对应模板，而 L4 是最常用页型
- [ ] `checklist.md` 的半自动校验脚本（色相越界检测 / 组件白名单扫描 / 一页多胶囊检测）
  - 注：v0.4 已解决其中最要命的一项（**溢出**，见 `verify.cjs`），剩下的色彩/白名单扫描可在此基础上扩展

## v0.7 — 载体与形态

- [ ] **本地 skill 化**：把 `SKILL.md` 装到 `~/.workbuddy/skills/`，让 Agent 自动触发（当前需手动指路）
- [ ] 载体 B：Web 产品落地页（同令牌、px 栅格）
- [ ] 单文件 HTML 打包（内联 CSS/JS，双击即开、可邮件分享）

## Backlog

- 更多参考手册语料逆向（GenScript 剩余 7 份 / 其他厂商）
- 字体栈标准化（中西文搭配、商业字体替代方案）
- 图表组件深化（现仅有双系列 `DataChart`）
