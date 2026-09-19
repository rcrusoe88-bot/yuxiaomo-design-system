# ROADMAP · 路线图

> 原则：**先用真实项目跑一遍，暴露真实缺口，再补能力。** 不拍脑袋造模板。

## v0.1 — 系统成型（2026-09-19）

- [x] 13 条可命名审美规则（带页码证据）
- [x] 5 套品牌主题令牌（blue / red / purple / wine / yuantai）
- [x] 24 个 React 组件（7 族）+ 16 个面性双色图标
- [x] 7 个版式原型 + 叙事铁律 + 密度节奏
- [x] AI slop 六类反模式黑名单
- [x] A4 打印链路（Playwright → PDF）+ 交付自检清单
- [x] 双主题 A4 样例（`examples/`）

## v0.2 — 扩展骨架

- [x] 扩展指南 `references/extending.md`（五类扩展 SOP + 完成定义 + 公开红线）
- [x] `templates/` 整页模板索引（T01–T07 待补）
- [x] `elements/` 设计元素母题登记（E01–E03 已实现）
- [x] `assets/` 品牌素材包规范
- [ ] **好坏样例对照** `examples/good-vs-bad.md`（同内容并排：系统产出 vs 典型 AI slop）——防 slop 最直接的一课
- [ ] 首个真实模板落地（建议从 T04 服务档位页开始）

## v0.3 — 第二批语料：MCE 五册逆向（当前完成）

- [x] 逆向 MCE 五册 145 页，产出 `设计元素完整清单_MCE.md`（含 5 处冲突判定）
- [x] 新增 3 族 / 10 个组件：`StagePipelineChain` `FunnelStages` `CycleFlowDiagram` `ComboEquationDiagram` / `TargetBarChart` `InstrumentReportPanel` `CitationBlock` / `CategoryTagRow` `ChipPillGrid` `IconFeatureList`
- [x] 新增 `color.js` 色彩派生工具（`pastelRamp` 等）
- [x] 新增规则 R14–R21
- [x] 6 页 A4 组件陈列 + `examples/components-v0.3.pdf`
- [ ] 实现队列 **P1**：`RowLabelMatrixTable` / `DotLeaderIndex` / `ContactFooterBand` / `BrandHeaderBar` / `GhostPairTitle`（默认关闭）
- [ ] 实现队列 **P2**：`CompareMatrixTable` / `CodedProductGrid` / `StatCompareCard` / `CategoryIconGrid` / `GelEvidencePanel` / `MediaCoverGrid` / `PathwayFigureCard` / `InstrumentPhotoGrid` / `FunnelBand` / `FeatureBulletList`
- [ ] 实现队列 **P3**：`TableOfContentsBand` / `SeriesListTable` / `ChartPanel` / `StructureGallery` / `DonutChartPanel` / `NumberedPlatformFigure` / `CircleBadge` / `Cover` 遮罩变体
- [ ] **待你决策的两项**：① 英文幽灵标题是否纳入默认标题体系；② 分子彩纸母题是否作为第 4 母题加入（当前决定：不加入）

## v0.4 — 按真实项目补齐

- [ ] 用本系统完整做一版公司手册，记录"哪一页找不到对应原型 / 组件"
- [ ] 按缺口补 T01–T07 模板与 E04+ 元素
- [ ] `checklist.md` 的半自动校验脚本（色相越界检测 / 组件白名单扫描 / 一页多胶囊检测）

## v0.4 — 载体与形态

- [ ] **本地 skill 化**：把 `SKILL.md` 装到 `~/.workbuddy/skills/`，让 Agent 自动触发（当前需手动指路）
- [ ] 载体 B：Web 产品落地页（同令牌、px 栅格）
- [ ] 单文件 HTML 打包（内联 CSS/JS，双击即开、可邮件分享）

## Backlog

- 更多参考手册语料逆向（GenScript 剩余 7 份 / 其他厂商）
- 字体栈标准化（中西文搭配、商业字体替代方案）
- 图表组件深化（现仅有双系列 `DataChart`）
