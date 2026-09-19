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
│   ├── rules.md                # 21 条可命名审美规则（R1–R21）
│   ├── tokens.md               # 主题令牌 / 颜色 / 字阶 / 间距
│   ├── components.md           # 37 个组件的 API 与用法（10 族）
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
│   ├── lib/                    # 组件库（themes/theme/primitives/structure/cards/tables/flow/case/process/data/tags/icons/color）
│   ├── demo/                   # 演示页：多主题巡展 + 真实文案手册
│   └── styles.css              # 基础样式 + A4 打印规则
├── examples/                   # 出品样例（PDF）
├── shot.cjs / export-pdf.cjs   # 截图 / A4 PDF 导出脚本
└── package.json
```

**两层复用关系**：`src/lib` 是**零件**（组件），`templates/` 是**装好的整页**（先挑模板拼骨架，再换真实文案与品牌素材）。`elements/` 放比组件更小的、与品牌无关的装饰母题。

## 快速开始

```bash
npm install
node node_modules/vite/bin/vite.js --port 5173   # 浏览器预览
node export-pdf.cjs output.pdf                    # 导出 A4 PDF（printBackground + preferCSSPageSize）
node shot.cjs                                     # 逐页截图（visual check）
```

## 主题一览（`src/lib/themes.js`）

| key | 名称 | 主色 | 深底 | 来源 |
|---|---|---|---|---|
| `blue` | 深海蓝 | `#019EDB` | `#006CB1` | 参考手册逆向 |
| `red` | 信号红 | `#EE3451` | `#701E20` | 参考手册逆向 |
| `purple` | 学术紫 | `#682E79` | `#2C1736` | 参考手册逆向 |
| `wine` | 酒红 | `#EE3250` | `#6F1D1F` | 参考手册逆向 |
| `yuantai` | 远泰红 | `#D80000` | `#606060` | 现实项目（红 + 深灰） |

每套主题含 7 个角色：`functional` / `header` / `dark` / `tint` / `zebra` / `capsuleLight` / `capsuleDeep`，外加 `ramp`（时间轴递变色带）。**加一家新公司 = 往 `themes.js` 加 8 行。**

## 组件总览（37 个，10 族）

- **A 结构页**：`Cover` / `SectionDivider` / `IslandBulletGrid` / `BackCover`
- **B 标题**：`PillTitle` / `H2` / `Sub` / `Lead` / `Footnotes`
- **C 表格**：`SpecTable` / `TierMatrixTable` / `ProductHeaderRow`
- **D 卡片**：`StatCardRow` / `TierCards` / `TestimonialCard` / `ConclusionBanner`
- **E 流程**：`FlowChain` / `IconFlowBar` / `TimelineBar` / `ChevronFlow`
- **F 案例证据**：`CaseBlock` / `EvidenceGrid` / `DataChart`
- **G 家具**：`Page` / `Folio` / `Icon`（16 个面性双色图标）/ `CapsuleDecor`（装饰原语，母题 E01）
- **H 流程图解**（v0.3）：`StagePipelineChain` / `FunnelStages` / `CycleFlowDiagram` / `ComboEquationDiagram`
- **I 数据证据**（v0.3）：`TargetBarChart` / `InstrumentReportPanel` / `CitationBlock`
- **J 标签**（v0.3）：`CategoryTagRow` / `ChipPillGrid` / `IconFeatureList`

另有色彩工具 `pastelRamp` / `mixWhite` / `mixBlack` / `shiftHue`：让组件从主题令牌**派生**浅色系，而非写死 hex。

## 编号命名空间

系统里并存六套编号，**互不通用**——引用时务必带前缀，否则 Agent 会误判指向哪个文件。

| 命名空间 | 含义 | 定义处 | 当前范围 |
|---|---|---|---|
| `R1–R21` | 可命名审美规则 | `references/rules.md` | 21 条 |
| 族 `A–J` | 组件族 | `references/components.md` | 10 族 / 37 组件 |
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

完整逆向报告：`行业参考手册库/GenScript_金斯瑞/设计元素完整清单_GenScript.md`、`行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md`。
方法可复用：《手册设计元素提炼提示词.md》。

## 许可

MIT（见 LICENSE）。参考手册的版式语言属公开可观察的设计事实；本仓库代码与文档为原创实现。
