# 设计令牌 · Tokens

> 全部色值为像素实测；主题即"品牌皮肤"，换公司只换这一层。

## 一、主题的 7 个角色

每套主题由 7 个语义角色 + 1 条时间轴色带构成。**页面里永远引用角色名，不写死色值。**

| 角色 | 用途 | 用在哪些组件 |
|---|---|---|
| `functional` | 功能主色 | 胶囊页题 `PillTitle`、`H2`、图标主色、页码、结论实底横幅、图表深系列 |
| `header` | 表头 / 实底强调 | 表头 `SpecTable`、流程框顶条、套餐卡顶条、图标辅色 |
| `dark` | 结构深底 | 封面 `Cover`、章节页 `SectionDivider`（**仅结构页**） |
| `tint` | 卡片 / 高亮浅底 | `StatCardRow` 底、表格高亮格、`ConclusionBanner` 浅色版 |
| `zebra` | 斑马纹 / 标签列 | 表格偶数行、首列标签底 |
| `capsuleLight` | 胶囊棒浅档 / 图表浅系列 | `CapsuleDecor`、`DataChart` 浅系列、`TierMatrixTable` 浅档列头 |
| `capsuleDeep` | 胶囊棒深档 / 图标主色 | `CapsuleDecor`、图标主体、时间轴箭头 |
| `ramp` | 时间轴递变色带（浅→深） | `TimelineBar`、`ChevronFlow` |

> 另有两栏**非页面角色**：`accent` / `accent2`（来源手册里的第二、第三色，如 MCE 的橙 `#F09B40`、
> 青绿 `#58C6CE`）。它们只记录来源色板，**组件不自动取用** —— 一页出现多色相会破 R1，
> 需要时由调用方显式从 `theme.accent` 取。

## 二、内置主题（`src/lib/themes.js`，10 套）

主题分**两条来源脉 + 品牌脉**。组件不绑定主题，只声明自己属于哪条脉（契约 `src`），
「脉 → 册」由调用方选 —— 这就是「一套语言 × 多套主题」。

### 脉一 · GenScript 金斯瑞（三册 + 抗体章，像素实测）

| 角色 | blue 深海蓝 | red 信号红 | purple 学术紫 | wine 酒红 |
|---|---|---|---|---|
| 对应手册 | 核酸服务 | 细胞工程服务 | 蛋白&抗体服务 | 蛋白手册·抗体章 |
| functional | `#019EDB` | `#EE3451` | `#682E79` | `#EE3250` |
| header | `#019EDB` | `#F27292` | `#9664AA` | `#F07090` |
| dark | `#006CB1` | `#701E20` | `#2C1736` | `#6F1D1F` |
| tint | `#F0FAFD` | `#FDF0F2` | `#F2F0F5` | `#F8E8E8` |
| zebra | `#F5FBFD` | `#FEF6F7` | `#F2F0F5` | `#FEF6F7` |
| capsuleLight | `#92CEE7` | `#F27292` | `#C797C4` | `#F2829E` |
| capsuleDeep | `#1E3C92` | `#C3263C` | `#2C1736` | `#6F1D1F` |

### 脉二 · MCE 皓元（五册，**v0.5 补齐**）

来源：《设计元素完整清单_MCE.md》第〇节「五册实测主色」表。该表只列 主色 / 辅助色 / 深底 三档，
其余角色由主色**派生**（`derived()`：tint = 7% 白、zebra = 3.5% 白、capsuleDeep = 35% 黑、ramp = 4 阶浅→深）。

| 角色 | mce-library 化合物库 | mce-discovery 药物发现 | mce-protac | mce-qms | mce-biochem 生化试剂 |
|---|---|---|---|---|---|
| functional（实测） | `#2C6BAA` | `#574DA0` | `#5A3A7D` | `#F16366` | `#2995B3` |
| header | `#2C6BAA` | `#6A6AB0` | `#5A3A7D` | `#F16366` | `#2995B3` |
| dark | `#2670B8` | `#030017` | 派生 | `#120E0F` | 派生 |
| accent（实测，仅记录） | `#F09B40` 橙 | `#DBB356` 金 | `#DC5973` 玫红 | `#41B3B9` 青 | `#F6F5B6` 淡黄 |
| accent2（实测，仅记录） | `#58C6CE` 青绿 | `#FCBB6D` 橙 | `#C44159` | `#FCBB6D` 橙 | `#A67AB6` 紫 |
| tint | `#F1F9FD`（实测） | 派生 | 派生 | 派生 | 派生 |
| zebra | `#F1F9FD`（实测） | 派生 | 派生 | `#EFEFEF`（实测） | 派生 |
| capsuleLight | `#B6E6F1`（实测） | `#D3CBE5`（实测） | 派生 | `#C1E7ED`（实测） | 派生 |
| capsuleDeep | `#2670B8`（实测） | 派生 | 派生 | 派生 | 派生 |

> ⚠ `accent` / `accent2` **只作来源记录，组件不自动套用**。R1（一册一色相）优先于逐色还原 ——
> 见 `BarTitle` 契约：「MCE library p8 青色 #58C6CE（本系统改用主题主色以守 R1）」。

### 品牌脉 · 成稿换肤

| 角色 | yuantai 远泰红 |
|---|---|
| functional | `#D80000` |
| header | `#D80000` |
| dark | `#606060` |
| tint / zebra | `#FBECEC` / `#FCF5F5` |
| capsuleLight / capsuleDeep | `#F2C2C2` / `#404040` |

品牌脉**不属于任何来源脉**（`corpus: 'brand'`）。它用于"把整册换成自家品牌色"的成稿视角，
在陈列页对应「品牌模式」—— 该模式下所有组件（含锁定册的）统一跟随。

## 三、中性色（全主题通用 `NEUTRAL`）

| 角色 | Hex | 用途 |
|---|---|---|
| text | `#4D4D4F` | 全部正文 / 表格内容 |
| textSoft | `#808080` | 脚注、图例、来源 |
| line | `#C8C8C8` | 表格横线（≈0.5pt） |
| ghost | `#C0C0C0` | 目录装饰大字 |
| control | `#E8963C` | **唯一许可的第二色相**：图表阳性对照 / 对比组 |
| compare | `#1870B8` | 对照实验标注（备用） |

## 四、字阶（正文 = 1× ≈ 9~10.5pt）

| 层级 | 倍数 | 字重 | 颜色 |
|---|---|---|---|
| 封面中文主标 | 5.4×~6.0× | Heavy | 白 |
| 目录幽灵大字 | 7.5× | Bold | `#C0C0C0`（装饰） |
| 章节页主标题 | 4.2× | Bold | 白 |
| 封面/章节英文副标 | 2.1×~2.4× | Regular | 白 |
| 页胶囊标题 `PillTitle` | 1.9×~2.0× | Bold | 白（实底胶囊内） |
| 小节标题 `H2` | 1.4×~1.6× | Bold | 主题色 |
| 卡片标题 | 1.05×~1.2× | Bold | 近黑 `#333` |
| 正文 | 1.0× | Regular | text |
| 表格 / 注释 | 0.85× | Regular | text |
| 脚注 / 页码 | 0.7×~0.8× | Regular | textSoft |

**字重只有三级**（Heavy / Bold / Regular），没有中间态。**一切标题居中**；表格文字居中；正文两端对齐、无首行缩进、段落间空行。

## 五、质感速查（实测值）

| 项 | 值 |
|---|---|
| 表格行线 | 0.5pt `#C8C8C8`，通栏横线，**无竖线** |
| 表头白缝 | 2~3px 列间白缝（不是描边） |
| 圆角四档 | 胶囊 r=高/2 ｜ scoop 右上 22~40px ｜ 微圆 6~10px ｜ 图片 0 |
| 阴影 | **无**（全稿零投影） |
| 渐变 | 仅 tint 卡 15% 亮度内垂直微渐变；装饰禁渐变 |
| 描边 | 流程框 0.75pt 主题色；时间轴箭头线 ~1.5px 深色 |
| 行高 | 紧凑表 ~15pt / 宽松表 ~22pt |
| 版心 | A4 210×297mm，左右边距 14~15mm，页脚仅页码 |

## 六、加一套新主题（3 步）

```js
// src/lib/themes.js
export const THEMES = {
  // …
  acme: {
    name: 'ACME 绿',
    corpus: 'brand',            // 'genscript' / 'mce' / 'brand'；新来源脉请同时在 CORPORA 里登记
    manual: 'ACME 品牌手册',
    functional: '#1F7A4D',
    header: '#1F7A4D',
    dark: '#123F2A',
    tint: '#EDF7F1',
    zebra: '#F5FBF7',
    capsuleLight: '#8FD0AE',
    capsuleDeep: '#0E3322',
    ramp: ['#8FD0AE', '#4CA57A', '#1F7A4D', '#0E3322'],
  },
}
```

规则：**7 个角色必须在同一色相家族内**（R1）；`dark` 要显著深于 `functional`；`ramp` 是浅→深 4 档。
加完即可 `<ThemeProvider theme="acme">` 使用，无需改任何组件。

若实测值只覆盖部分角色，用 `...derived('#1F7A4D')` 补齐 —— **不要手工编 hex，也不要把派生值当实测值写**。

## 七、加一位新来源（若要接入第六本手册）

1. `themes.js` 里加 `THEMES` 条目（`corpus` 指向新脉）；
2. `CORPORA` 里登记新脉与它的册列表；
3. 组件的 `src` 才允许写这个新脉 —— 否则 `npm run registry` 会报「src 不是合法来源脉」，
   `npm run audit` 会报「themes.js 缺主题 / corpus 回指不符」。

这三步是**故意**的：v0.4 的"全部变蓝"就是因为只有第 1 步被做了（其实一步都没做），
而没有任何检查发现"契约声明的脉"和"实际存在的主题"对不上。
