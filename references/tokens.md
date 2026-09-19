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

## 二、内置主题（`src/lib/themes.js`）

| 角色 | blue 深海蓝 | red 信号红 | purple 学术紫 | wine 酒红 | yuantai 远泰红 |
|---|---|---|---|---|---|
| functional | `#019EDB` | `#EE3451` | `#682E79` | `#EE3250` | `#D80000` |
| header | `#019EDB` | `#F27292` | `#9664AA` | `#F07090` | `#D80000` |
| dark | `#006CB1` | `#701E20` | `#2C1736` | `#6F1D1F` | `#606060` |
| tint | `#F0FAFD` | `#FDF0F2` | `#F2F0F5` | `#F8E8E8` | `#FBECEC` |
| zebra | `#F5FBFD` | `#FEF6F7` | `#F2F0F5` | `#FEF6F7` | `#FCF5F5` |
| capsuleLight | `#92CEE7` | `#F27292` | `#C797C4` | `#F2829E` | `#F2C2C2` |
| capsuleDeep | `#1E3C92` | `#C3263C` | `#2C1736` | `#6F1D1F` | `#404040` |

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

规则：**7 个角色必须在同一色相家族内**（R1）；`dark` 要显著深于 `functional`；`ramp` 是浅→深 4 档。加完即可 `<ThemeProvider theme="acme">` 使用，无需改任何组件。
