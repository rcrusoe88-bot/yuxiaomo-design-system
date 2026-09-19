# Yuxiaomo Design System · 个人产品页设计系统

> **一套设计语言 × 无限品牌主题。** 为任意公司设计产品页/产品手册时，Agent 参照本系统即可稳定输出——不发散、不产生 AI slop。

本系统由三部分构成：**可命名的审美规则**（rules）、**可复用的 React 组件**（components）、**可套用的版式原型**（layouts）。三者与品牌主题令牌解耦，换公司只换主题。

## 目录结构

```
yuxiaomo-design-system/
├── SKILL.md                    # ⭐ AI 入口：工作流 + 硬约束 + 反模式
├── README.md                   # 本文件：人的入口
├── design-language.md          # 设计基因：为什么这样设计
├── references/                 # 被参照的规范（Agent 按需读）
│   ├── rules.md                # 13 条可命名审美规则
│   ├── tokens.md               # 主题令牌 / 颜色 / 字阶 / 间距
│   ├── components.md           # 24 个组件的 API 与用法
│   ├── layouts.md              # 7 个版式原型 + 叙事铁律
│   ├── anti-patterns.md        # AI slop 反模式黑名单
│   └── checklist.md            # 交付前自检清单
├── src/
│   ├── lib/                    # 组件库（themes/theme/primitives/structure/cards/tables/flow/case/icons）
│   ├── demo/                   # 演示页：多主题巡展 + 真实文案手册
│   └── styles.css              # 基础样式 + A4 打印规则
├── examples/                   # 出品样例（PDF）
├── assets/                     # 模板/素材（规划中）
├── shot.cjs / export-pdf.cjs   # 截图 / A4 PDF 导出脚本
└── package.json
```

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

## 组件总览（24 个，7 族）

- **A 结构页**：`Cover` / `SectionDivider` / `IslandBulletGrid` / `BackCover`
- **B 标题**：`PillTitle` / `H2` / `Sub` / `Lead`
- **C 表格**：`SpecTable` / `TierMatrixTable` / `ProductHeaderRow`
- **D 卡片**：`StatCardRow` / `TierCards` / `TestimonialCard` / `ConclusionBanner`
- **E 流程**：`FlowChain` / `IconFlowBar` / `TimelineBar` / `ChevronFlow`
- **F 案例证据**：`CaseBlock` / `EvidenceGrid` / `DataChart`
- **G 家具**：`Page` / `Folio` / `Footnotes` / `Icon`（16 个面性双色图标）

## 设计来源

规则与令牌源自对 GenScript（金斯瑞）三份产品手册（44 页）的逐页视觉逆向 + 像素级色值实测，并经真实项目（远泰生物 mRNA-LNP 手册）迭代校准。详见 `references/rules.md` 各条规则的页码证据。

## 许可

MIT（见 LICENSE）。参考手册的版式语言属公开可观察的设计事实；本仓库代码与文档为原创实现。
