# CHANGELOG

遵循「只加不改语义」（additive-first）：新增能力升**次版本**；修改既有组件 / 令牌的语义或默认值属破坏性变更，必须在此记明并检查 `examples/` 全部样例是否仍成立。

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
- `references/extending.md`：五类扩展 SOP（品牌主题 / React 组件 / 版式原型 / 参考模板 / 设计元素）+ 四条铁律 + 完成定义（DoD）+ 公开仓库素材红线。
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

- 首个版本：13 条可命名审美规则、5 套品牌主题、24 个组件、7 个版式原型、AI slop 六类反模式、A4 打印链路、双主题 A4 样例。
- 来源：GenScript（金斯瑞）三份产品手册共 44 页的逐页视觉逆向 + 像素级色值实测，经真实项目（远泰生物 mRNA-LNP 手册）迭代校准。
