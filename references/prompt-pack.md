# 提示词包 · Prompt Pack（71 个组件 / 14 族）

> **本文件由 `scripts/registry.mjs` 从组件源码生成，不要手改。**
> 契约的唯一真相源是 `src/lib/*.jsx` 里紧贴组件上方的 `/* @ds-contract */` 块。
> 复制每节的「提示词」直接给模型即可；「配置代码」是可运行的 JSX 用法。

## 系统级约束（每个提示词都已自带，此处便于通读）

| # | 约束 | 内容 |
|---|---|---|
| R1 | 一册一色相 | 一份手册只有一个品牌色相，副色仅用于图表橙 |
| R4 | 组件不写死色 | 颜色一律从主题令牌派生，禁止页面里出现 hex |
| R14 | 一站一拓扑 | 同一语义全册只用一种拓扑；不同语义绝不共用 |
| R16 | 两种表格语体不混 | 营销参数表 `SpecTable` ↔ 技术数据表 `InstrumentReportPanel` |
| R22 | 类目色纪律 | 多档配色默认同色相（`tone`）；跨色相须显式且全册锁定 |
| **R23** | **配色随来源，不随默认** | **组件的配色由它的来源脉（`src`）决定；不得把所有组件统一成蓝色。每条组件的来源脉见下表** |

### 组件来源脉（`src`）—— R23 的机器可读依据

| `src` | 来源 | 该脉可选主题（「脉内换册」只换主色、不换结构） |
|---|---|---|
| `genscript` | GenScript 金斯瑞 | `blue` 核酸服务手册 · `red` 细胞工程服务手册 · `purple` 蛋白&抗体服务手册 · `wine` 蛋白手册 · 抗体章 |
| `mce` | MCE 皓元 | `mce-library` 化合物库手册 · `mce-discovery` 药物发现服务 · `mce-protac` PROTAC 手册 · `mce-qms` 质量管理体系 · `mce-biochem` 生化试剂 |
| `neutral` | 中性文本层 | —（不引入色相，随调用页主题） |

> 用法：先读组件的 `src`，再从该脉选一册主题，**整份文档只用所选那一册**（R1 一册一色相）。
> 不要用 A 脉的册去渲染 B 脉的组件 —— 那正是「全部变蓝」的成因。

---

## 族 A · 结构页（4 个）

### `BackCover` · v0.1

| | |
|---|---|
| 语义 | 深色封底：满版胶囊棒矩阵 + 联系列表 + 版本码，全册视觉重量最重 |
| 何时用 | 手册最后一页 |
| 何时不用 | 内页底部联系带 → ContactFooterBand |
| 配套 | CapsuleDecor（内置，preset=backcover） |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 BackCover（族 A 结构页）实现该区块。

语义：深色封底：满版胶囊棒矩阵 + 联系列表 + 版本码，全册视觉重量最重
何时用：手册最后一页
何时不用：内页底部联系带 → ContactFooterBand
配套：CapsuleDecor（内置，preset=backcover）
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BackCover contacts={[{ type: 'mail', text: 'service@yuantai.com' }]} version="v2.0 · 2026.09" />
```

**配置代码**

```jsx
import { BackCover } from './src/lib'

<BackCover contacts={[{ type: 'mail', text: 'service@yuantai.com' }]} version="v2.0 · 2026.09" />
```

<details><summary>组件源码（structure.jsx · 22 行）</summary>

```jsx
export function BackCover({ contacts, version, heading = '更多详情，欢迎访问', style }) {
  const t = useTheme()
  const icons = { web: 'globe', phone: 'phone', mail: 'mail', addr: 'pin' }
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: '#fff', ...style,
    }}>
      <CapsuleDecor preset="backcover" />
      <div style={{ position: 'absolute', left: '14mm', bottom: '16mm', zIndex: 2 }}>
        <div style={{ fontWeight: 700, fontSize: '10.5pt', color: '#414042', marginBottom: '3mm' }}>{heading}</div>
        {contacts.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.5mm', marginBottom: '2.2mm' }}>
            <Icon name={icons[c.type] || 'globe'} size={13} primary="#6B6B6E" secondary="#6B6B6E" />
            <span style={{ fontSize: '9pt', color: '#4D4D4F' }}>{c.text}</span>
          </div>
        ))}
        {version && <div style={{ fontSize: '7.5pt', color: '#9A9A9C', marginTop: '5mm' }}>{version}</div>}
      </div>
    </div>
  )
}
```

</details>

### `Cover` · v0.1

| | |
|---|---|
| 语义 | 满版深底封面：全册唯一的深色满版页，承载标题组 + 品牌标识 |
| 何时用 | 手册第 1 页 |
| 何时不用 | 内页（内页禁止满版深底 R2）→ Page；章节开篇 → SectionDivider；封底 → BackCover |
| 配套 | CapsuleDecor（内置，preset=cover） |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Cover（族 A 结构页）实现该区块。

语义：满版深底封面：全册唯一的深色满版页，承载标题组 + 品牌标识
何时用：手册第 1 页
何时不用：内页（内页禁止满版深底 R2）→ Page；章节开篇 → SectionDivider；封底 → BackCover
配套：CapsuleDecor（内置，preset=cover）
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Cover title="mRNA-LNP 一站式 CDMO 服务" enTitle="mRNA-LNP CDMO Services" tagline="从序列设计到制剂灌装" logo={logoImg} />
```

**配置代码**

```jsx
import { Cover } from './src/lib'

<Cover title="mRNA-LNP 一站式 CDMO 服务" enTitle="mRNA-LNP CDMO Services" tagline="从序列设计到制剂灌装" logo={logoImg} />
```

<details><summary>组件源码（structure.jsx · 26 行）</summary>

```jsx
export function Cover({ title, enTitle, logo, tagline, children, style }) {
  const t = useTheme()
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: t.dark, color: '#fff', ...style,
    }}>
      <CapsuleDecor preset="cover" />
      {/* 右上反白 logo 区 */}
      <div style={{ position: 'absolute', top: '22mm', right: '18mm', textAlign: 'right' }}>
        {logo || (
          <div style={{ fontSize: '17pt', fontWeight: 800, letterSpacing: '0.5px' }}>
            YourBrand
            {tagline && <div style={{ fontSize: '7pt', fontWeight: 400, opacity: 0.9 }}>{tagline}</div>}
          </div>
        )}
      </div>
      {/* 右中标题组 */}
      <div style={{ position: 'absolute', top: '96mm', left: '96mm', right: '16mm' }}>
        <div style={{ fontSize: '34pt', fontWeight: 800, lineHeight: 1.28 }}>{title}</div>
        {enTitle && <div style={{ fontSize: '16pt', fontWeight: 400, marginTop: '5mm', lineHeight: 1.4 }}>{enTitle}</div>}
        {children}
      </div>
    </div>
  )
}
```

</details>

### `IslandBulletGrid` · v0.1

| | |
|---|---|
| 语义 | 章节页信息岛内的 3×N 分栏网格（主题色粗体标题 + bullet 组） |
| 何时用 | 章节总览页的「本节包含什么」；服务范围罗列 |
| 何时不用 | 内页正文列举 → BulletList；多产品参数对照 → SpecTable |
| 配套 | SectionDivider |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 IslandBulletGrid（族 A 结构页）实现该区块。

语义：章节页信息岛内的 3×N 分栏网格（主题色粗体标题 + bullet 组）
何时用：章节总览页的「本节包含什么」；服务范围罗列
何时不用：内页正文列举 → BulletList；多产品参数对照 → SpecTable
配套：SectionDivider
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<IslandBulletGrid groups={[{ title: '质粒质控', bullets: ['酶切图谱', '全长测序'] }]} />
```

**配置代码**

```jsx
import { IslandBulletGrid } from './src/lib'

<IslandBulletGrid groups={[{ title: '质粒质控', bullets: ['酶切图谱', '全长测序'] }]} />
```

<details><summary>组件源码（structure.jsx · 17 行）</summary>

```jsx
export function IslandBulletGrid({ groups }) {
  const t = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6mm 8mm' }}>
      {groups.map((g, i) => (
        <div key={i}>
          <div style={{ color: t.functional, fontWeight: 700, fontSize: '10.5pt', marginBottom: '1.5mm' }}>{g.title}</div>
          {g.bullets.map((b, j) => (
            <div key={j} style={{ color: '#4D4D4F', fontSize: '8.5pt', lineHeight: 1.55, marginBottom: '1mm' }}>
              <span style={{ color: t.functional, marginRight: '1.2mm' }}>•</span>{b}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

</details>

### `SectionDivider` · v0.1

| | |
|---|---|
| 语义 | 章节总览页：深底 + 下半页白色大圆角信息岛，宣告「这一章讲什么」 |
| 何时用 | 每个大章节的开篇页 |
| 何时不用 | 内容页 → Page；封面/封底 → Cover / BackCover |
| 配套 | IslandBulletGrid（岛内容） |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 SectionDivider（族 A 结构页）实现该区块。

语义：章节总览页：深底 + 下半页白色大圆角信息岛，宣告「这一章讲什么」
何时用：每个大章节的开篇页
何时不用：内容页 → Page；封面/封底 → Cover / BackCover
配套：IslandBulletGrid（岛内容）
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<SectionDivider chapterNo="02" title="检测服务" lead="覆盖质粒、病毒载体与 LNP 的全流程质控">{岛内容}</SectionDivider>
```

**配置代码**

```jsx
import { SectionDivider } from './src/lib'

<SectionDivider chapterNo="02" title="检测服务" lead="覆盖质粒、病毒载体与 LNP 的全流程质控">{岛内容}</SectionDivider>
```

<details><summary>组件源码（structure.jsx · 23 行）</summary>

```jsx
export function SectionDivider({ chapterNo, title, lead, children, style }) {
  const t = useTheme()
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: t.dark, color: '#fff', padding: '26mm 15mm 20mm', boxSizing: 'border-box', ...style,
    }}>
      <CapsuleDecor preset="corner" style={{ opacity: 0.55 }} />
      {chapterNo && <div style={{ fontSize: '13pt', fontWeight: 700, opacity: 0.9, marginBottom: '3mm' }}>{chapterNo}</div>}
      <div style={{ fontSize: '26pt', fontWeight: 800, lineHeight: 1.3 }}>{title}</div>
      {lead && (
        <p style={{ fontSize: '10pt', lineHeight: 1.8, marginTop: '6mm', maxWidth: '165mm', opacity: 0.95 }}>{lead}</p>
      )}
      {/* 白色信息岛 */}
      <div style={{
        position: 'absolute', left: '15mm', right: '15mm', bottom: '20mm',
        background: '#fff', borderRadius: '6mm', color: '#333', padding: '9mm 10mm',
      }}>
        {children}
      </div>
    </div>
  )
}
```

</details>

---

## 族 B · 标题族（12 个）

### `BarTitle` · v0.4

| | |
|---|---|
| 语义 | 左粗色条 + 深灰粗字的 H2 级小节标题（条高随文字伸展） |
| 何时用 | 同一页内第 2、3 组小节的标题 |
| 何时不用 | 与 RuleTitle 混用（全册 H2 只用一种）；页题 → H1 系列 |
| 配套 | RuleTitle（二选一，不可并用） |
| **来源配色** | **MCE library p8 青色 #58C6CE（本系统改用主题主色以守 R1）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p8（原页 12pt 青色小标题，改主色守 R1） |

**提示词**（直接复制）

```text
用本设计系统的 BarTitle（族 B 标题族）实现该区块。

语义：左粗色条 + 深灰粗字的 H2 级小节标题（条高随文字伸展）
何时用：同一页内第 2、3 组小节的标题
何时不用：与 RuleTitle 混用（全册 H2 只用一种）；页题 → H1 系列
配套：RuleTitle（二选一，不可并用）
来源配色：MCE library p8 青色 #58C6CE（本系统改用主题主色以守 R1）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BarTitle en="Workflow" level={2}>服务流程</BarTitle>
```

**配置代码**

```jsx
import { BarTitle } from './src/lib'

<BarTitle en="Workflow" level={2}>服务流程</BarTitle>
```

<details><summary>组件源码（titles.jsx · 19 行）</summary>

```jsx
export function BarTitle({ children, sub, en, level = 2, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ display: 'flex', gap: '2.6mm', alignItems: 'stretch', margin: '5mm 0 3mm', ...style }}>
      <div style={{ flex: '0 0 1.6mm', background: t.functional, borderRadius: '0.8mm' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.4mm', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: SUB_SIZE[level] || SUB_SIZE[2], fontWeight: 700, color: '#333', lineHeight: 1.35,
          }}>{children}</span>
          {en && <span style={{ fontSize: '7.5pt', fontWeight: 300, color: n.textSoft }}>{en}</span>}
        </div>
        {sub && (
          <div style={{ fontSize: '8.5pt', color: n.text, marginTop: '1.2mm', lineHeight: 1.6 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}
```

</details>

### `BlockTitle` · v0.4

| | |
|---|---|
| 语义 | 方块实底页题（直角 1.2mm 柔化边角）——视觉上是「逗号」 |
| 何时用 | 分栏、并列、可重复的段落页题；技术感 / 硬朗场合 |
| 何时不用 | 收口式单点承诺 → PillTitle（胶囊只允许一页 1 个，方块允许 2 个） |
| 配套 | OutlineTitle（并置形成主次对照） |
| **来源配色** | **GenScript 胶囊型 → 直角变体 · 随主题** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 BlockTitle（族 B 标题族）实现该区块。

语义：方块实底页题（直角 1.2mm 柔化边角）——视觉上是「逗号」
何时用：分栏、并列、可重复的段落页题；技术感 / 硬朗场合
何时不用：收口式单点承诺 → PillTitle（胶囊只允许一页 1 个，方块允许 2 个）
配套：OutlineTitle（并置形成主次对照）
来源配色：GenScript 胶囊型 → 直角变体 · 随主题
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BlockTitle en="Analytical development">分析方法开发</BlockTitle>
```

**配置代码**

```jsx
import { BlockTitle } from './src/lib'

<BlockTitle en="Analytical development">分析方法开发</BlockTitle>
```

<details><summary>组件源码（titles.jsx · 24 行）</summary>

```jsx
export function BlockTitle({ children, en, tone = 'solid', size = 'md', width, inline = false, style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  const solid = tone === 'solid'
  const tinted = tone === 'tint'
  return (
    <div style={{ margin: '0 0 5mm', ...style }}>
      <div style={{
        display: inline ? 'inline-block' : 'block', width,
        background: solid ? t.functional : tinted ? t.tint : 'transparent',
        color: solid ? '#fff' : t.functional,
        border: tinted || solid ? 'none' : `0.75pt solid ${t.functional}`,
        fontSize: c, fontWeight: 700, lineHeight: 1.3,
        padding: '2.4mm 6mm', borderRadius: '1.2mm',
      }}>{children}</div>
      {en && (
        <div style={{
          fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm', lineHeight: 1.35,
        }}>{en}</div>
      )}
    </div>
  )
}
```

</details>

### `EyebrowTitle` · v0.4

| | |
|---|---|
| 语义 | 眉标：标题之上的小字 + 短色条，标「编号 / 分类 / 章节归属」 |
| 何时用 | 页题之上标注章节归属（如「第 3 章 · 检测服务」）；目录号 |
| 何时不用 | 当页题使用（它是眉，不是题）→ PairTitle / BlockTitle |
| 配套 | PairTitle |
| **来源配色** | **MCE 化合物库手册 橙 #F09B40（编号 / 文献专用）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE 五册逆向（原页橙色 10pt，本系统改主色以守 R1） |

**提示词**（直接复制）

```text
用本设计系统的 EyebrowTitle（族 B 标题族）实现该区块。

语义：眉标：标题之上的小字 + 短色条，标「编号 / 分类 / 章节归属」
何时用：页题之上标注章节归属（如「第 3 章 · 检测服务」）；目录号
何时不用：当页题使用（它是眉，不是题）→ PairTitle / BlockTitle
配套：PairTitle
来源配色：MCE 化合物库手册 橙 #F09B40（编号 / 文献专用）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<EyebrowTitle items={['第 3 章', '检测服务']} />
```

**配置代码**

```jsx
import { EyebrowTitle } from './src/lib'

<EyebrowTitle items={['第 3 章', '检测服务']} />
```

<details><summary>组件源码（titles.jsx · 18 行）</summary>

```jsx
export function EyebrowTitle({ items = [], align = 'left', divider = '·', tone = 'primary', style }) {
  const t = useTheme(); const n = useNeutral()
  const color = tone === 'accent' ? n.control : tone === 'muted' ? n.textSoft : t.functional
  const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.6mm', justifyContent: justify,
      fontSize: '9.5pt', color, lineHeight: 1.3, ...style,
    }}>
      {items.map((s, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.6mm' }}>
          {i > 0 && <span style={{ opacity: 0.45 }}>{divider}</span>}
          <span style={{ fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
        </span>
      ))}
    </div>
  )
}
```

</details>

### `Footnotes` · v0.1

| | |
|---|---|
| 语义 | 页脚 * 开头的灰色小字（数据口径 / 免责说明） |
| 何时用 | 页脚最末的口径说明、适用范围 |
| 何时不用 | 版心内的关键提醒 → NoteBand（Footnotes 只在页脚，且最轻） |
| 配套 | Page |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Footnotes（族 B 标题族）实现该区块。

语义：页脚 * 开头的灰色小字（数据口径 / 免责说明）
何时用：页脚最末的口径说明、适用范围
何时不用：版心内的关键提醒 → NoteBand（Footnotes 只在页脚，且最轻）
配套：Page
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Footnotes items={['* 数据为示例，不构成承诺。']} />
```

**配置代码**

```jsx
import { Footnotes } from './src/lib'

<Footnotes items={['* 数据为示例，不构成承诺。']} />
```

<details><summary>组件源码（primitives.jsx · 8 行）</summary>

```jsx
export function Footnotes({ items, style }) {
  const n = useNeutral()
  return (
    <div style={{ color: n.textSoft, fontSize: '7.5pt', lineHeight: 1.6, marginTop: '2.5mm', ...style }}>
      {items.map((s, i) => <div key={i}>* {s}</div>)}
    </div>
  )
}
```

</details>

### `H2` · v0.1

| | |
|---|---|
| 语义 | 主题色粗体居中二级标题，无底无装饰 |
| 何时用 | 需要中置的小节标题 |
| 何时不用 | 左对齐正文流里的小节 → BarTitle；页题 → H1 系列（PillTitle/BlockTitle/PairTitle） |
| 配套 | Sub |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 H2（族 B 标题族）实现该区块。

语义：主题色粗体居中二级标题，无底无装饰
何时用：需要中置的小节标题
何时不用：左对齐正文流里的小节 → BarTitle；页题 → H1 系列（PillTitle/BlockTitle/PairTitle）
配套：Sub
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<H2>服务流程</H2>
```

**配置代码**

```jsx
import { H2 } from './src/lib'

<H2>服务流程</H2>
```

<details><summary>组件源码（primitives.jsx · 9 行）</summary>

```jsx
export function H2({ children, style }) {
  const t = useTheme()
  return (
    <div style={{
      textAlign: 'center', color: t.functional, fontWeight: 700,
      fontSize: '13.5pt', margin: '7mm 0 2.5mm', ...style,
    }}>{children}</div>
  )
}
```

</details>

### `Lead` · v0.1

| | |
|---|---|
| 语义 | 通栏引导段落（两端对齐，页题下的第一段导语） |
| 何时用 | 页题之下的开篇导语 |
| 何时不用 | 多段落正文 → BodyText（Lead 一段就够） |
| 配套 | PillTitle, H2 |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Lead（族 B 标题族）实现该区块。

语义：通栏引导段落（两端对齐，页题下的第一段导语）
何时用：页题之下的开篇导语
何时不用：多段落正文 → BodyText（Lead 一段就够）
配套：PillTitle, H2
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Lead>作为一站式 CDMO 服务商，我们覆盖质粒、mRNA 与 LNP 全链条。</Lead>
```

**配置代码**

```jsx
import { Lead } from './src/lib'

<Lead>作为一站式 CDMO 服务商，我们覆盖质粒、mRNA 与 LNP 全链条。</Lead>
```

<details><summary>组件源码（primitives.jsx · 9 行）</summary>

```jsx
export function Lead({ children, style }) {
  const n = useNeutral()
  return (
    <p style={{
      color: n.text, fontSize: '9.5pt', lineHeight: 1.7, textAlign: 'justify',
      margin: '0 0 5mm', ...style,
    }}>{children}</p>
  )
}
```

</details>

### `NumberedTitle` · v0.4

| | |
|---|---|
| 语义 | 前置大号编号的页题（01 / 06），编号用主题色大字 + 细竖线分隔 |
| 何时用 | 内容天然有序时（章节、流程步骤、套餐档位） |
| 何时不用 | 无序内容 → BarTitle；纯粹的小节划分 → RuleTitle |
| 配套 | TocList |
| **来源配色** | **MCE 化合物库手册（编号色 = 分区主题色 #2C6BAA 的 tint）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 NumberedTitle（族 B 标题族）实现该区块。

语义：前置大号编号的页题（01 / 06），编号用主题色大字 + 细竖线分隔
何时用：内容天然有序时（章节、流程步骤、套餐档位）
何时不用：无序内容 → BarTitle；纯粹的小节划分 → RuleTitle
配套：TocList
来源配色：MCE 化合物库手册（编号色 = 分区主题色 #2C6BAA 的 tint）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<NumberedTitle index={1} total={6} en="Analytical development">分析开发</NumberedTitle>
```

**配置代码**

```jsx
import { NumberedTitle } from './src/lib'

<NumberedTitle index={1} total={6} en="Analytical development">分析开发</NumberedTitle>
```

<details><summary>组件源码（titles.jsx · 23 行）</summary>

```jsx
export function NumberedTitle({ index, total, children, en, size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const num = String(index).padStart(2, '0')
  const c = CN_SIZE[size] || CN_SIZE.md
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3.4mm', margin: '0 0 5mm', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexShrink: 0 }}>
        <span style={{
          fontSize: '21pt', fontWeight: 700, color: t.functional, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px',
        }}>{num}</span>
        {total != null && (
          <span style={{ fontSize: '8.5pt', color: n.textSoft, marginLeft: '0.6mm' }}>/{String(total).padStart(2, '0')}</span>
        )}
      </div>
      <div style={{ flex: '0 0 0.5pt', alignSelf: 'stretch', background: n.line, minHeight: '7mm' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: c, fontWeight: 700, color: '#333', lineHeight: 1.28 }}>{children}</div>
        {en && <div style={{ fontSize: '8.5pt', fontWeight: 300, color: n.textSoft, marginTop: '1.2mm' }}>{en}</div>}
      </div>
    </div>
  )
}
```

</details>

### `OutlineTitle` · v0.4

| | |
|---|---|
| 语义 | 描边空心页题：主题色细描边 + 主题色字 + 透明底 |
| 何时用 | 与 BlockTitle 同页并置作「次要」；不想让色块压住底纹时 |
| 何时不用 | 需要强调的页题 → BlockTitle |
| 配套 | BlockTitle |
| **来源配色** | **BlockTitle 轻量变体 · 随主题（描边+主色字，不加新色）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 OutlineTitle（族 B 标题族）实现该区块。

语义：描边空心页题：主题色细描边 + 主题色字 + 透明底
何时用：与 BlockTitle 同页并置作「次要」；不想让色块压住底纹时
何时不用：需要强调的页题 → BlockTitle
配套：BlockTitle
来源配色：BlockTitle 轻量变体 · 随主题（描边+主色字，不加新色）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<OutlineTitle en="Add-on services">配套服务</OutlineTitle>
```

**配置代码**

```jsx
import { OutlineTitle } from './src/lib'

<OutlineTitle en="Add-on services">配套服务</OutlineTitle>
```

<details><summary>组件源码（titles.jsx · 16 行）</summary>

```jsx
export function OutlineTitle({ children, en, size = 'md', align = 'left', width, inline = false, style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  return (
    <div style={{ margin: '0 0 5mm', textAlign: align, ...style }}>
      <div style={{
        display: inline ? 'inline-block' : 'block', width,
        border: `0.75pt solid ${t.functional}`, color: t.functional, background: 'transparent',
        fontSize: c, fontWeight: 700, lineHeight: 1.3,
        padding: '2.2mm 6mm', borderRadius: '1.2mm', textAlign: 'center',
      }}>{children}</div>
      {en && <div style={{ fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm' }}>{en}</div>}
    </div>
  )
}
```

</details>

### `PairTitle` · v0.4

| | |
|---|---|
| 语义 | 中英对照页题：中文实标题 + 英文浅色副题，左对齐、无底、无装饰线 |
| 何时用 | 服务型手册的默认页题（MCE 五册主力形态） |
| 何时不用 | 一页出现两个 H1；硬朗技术感页题 → BlockTitle |
| 配套 | EyebrowTitle, BarTitle |
| **来源配色** | **MCE 多册 · 色相随册（library #2C6BAA / qms #F16366），形态不变** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE library p3/p6/p7/p45/p89 与 qms 全线 |

**提示词**（直接复制）

```text
用本设计系统的 PairTitle（族 B 标题族）实现该区块。

语义：中英对照页题：中文实标题 + 英文浅色副题，左对齐、无底、无装饰线
何时用：服务型手册的默认页题（MCE 五册主力形态）
何时不用：一页出现两个 H1；硬朗技术感页题 → BlockTitle
配套：EyebrowTitle, BarTitle
来源配色：MCE 多册 · 色相随册（library #2C6BAA / qms #F16366），形态不变
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<PairTitle cn="质粒与病毒载体质控" en="Plasmid & vector QC" />
```

**配置代码**

```jsx
import { PairTitle } from './src/lib'

<PairTitle cn="质粒与病毒载体质控" en="Plasmid & vector QC" />
```

<details><summary>组件源码（titles.jsx · 18 行）</summary>

```jsx
export function PairTitle({ cn, en, eyebrow, align = 'left', size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  return (
    <div style={{ textAlign: align, margin: '0 0 5mm', ...style }}>
      {eyebrow && <EyebrowTitle items={eyebrow} align={align} style={{ marginBottom: '1.8mm' }} />}
      <div style={{
        fontSize: c, fontWeight: 600, color: t.functional, lineHeight: 1.26, letterSpacing: '0.2px',
      }}>{cn}</div>
      {en && (
        <div style={{
          fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm', lineHeight: 1.35,
        }}>{en}</div>
      )}
    </div>
  )
}
```

</details>

### `PillTitle` · v0.1

| | |
|---|---|
| 语义 | 实底 stadium 胶囊页题（白字居中）——视觉上是「句号」 |
| 何时用 | 强承诺型页题；单点 CTA 页 |
| 何时不用 | 一页出现第 2 个（R3 一页一胶囊）；分栏并列可重复的段落标题 → BlockTitle |
| 配套 | Lead, Sub |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 PillTitle（族 B 标题族）实现该区块。

语义：实底 stadium 胶囊页题（白字居中）——视觉上是「句号」
何时用：强承诺型页题；单点 CTA 页
何时不用：一页出现第 2 个（R3 一页一胶囊）；分栏并列可重复的段落标题 → BlockTitle
配套：Lead, Sub
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<PillTitle width="120mm">端到端 mRNA-LNP 开发服务</PillTitle>
```

**配置代码**

```jsx
import { PillTitle } from './src/lib'

<PillTitle width="120mm">端到端 mRNA-LNP 开发服务</PillTitle>
```

<details><summary>组件源码（primitives.jsx · 12 行）</summary>

```jsx
export function PillTitle({ children, width, style }) {
  const t = useTheme()
  return (
    <div style={{ textAlign: 'center', margin: '6mm 0 7mm' }}>
      <span style={{
        display: 'inline-block', background: t.functional, color: '#fff',
        fontWeight: 700, fontSize: '16pt', lineHeight: 1, padding: '4.2mm 14mm',
        borderRadius: '999px', width, ...style,
      }}>{children}</span>
    </div>
  )
}
```

</details>

### `RuleTitle` · v0.4

| | |
|---|---|
| 语义 | 细线夹标题：上下细线夹字，最轻、最「期刊」的 H2 |
| 何时用 | 需要期刊感的分组隔断；把一页切成 2~3 组 |
| 何时不用 | 与 BarTitle 混用；页题 → H1 系列 |
| 配套 | BarTitle（二选一，不可并用） |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 RuleTitle（族 B 标题族）实现该区块。

语义：细线夹标题：上下细线夹字，最轻、最「期刊」的 H2
何时用：需要期刊感的分组隔断；把一页切成 2~3 组
何时不用：与 BarTitle 混用；页题 → H1 系列
配套：BarTitle（二选一，不可并用）
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<RuleTitle en="Process parameters">工艺参数</RuleTitle>
```

**配置代码**

```jsx
import { RuleTitle } from './src/lib'

<RuleTitle en="Process parameters">工艺参数</RuleTitle>
```

<details><summary>组件源码（titles.jsx · 17 行）</summary>

```jsx
export function RuleTitle({ children, en, note, align = 'left', ruleWidth = '14mm', style }) {
  const t = useTheme(); const n = useNeutral()
  const centered = align === 'center'
  return (
    <div style={{ margin: '5mm 0 3mm', textAlign: align, ...style }}>
      <div style={{
        width: ruleWidth, height: '0.9mm', background: t.functional, borderRadius: '0.5mm',
        margin: centered ? '0 auto 2.2mm' : '0 0 2.2mm',
      }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.6mm', justifyContent: centered ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11pt', fontWeight: 700, color: '#333', lineHeight: 1.35 }}>{children}</span>
        {en && <span style={{ fontSize: '7.5pt', fontWeight: 300, color: n.textSoft }}>{en}</span>}
        {note && <span style={{ fontSize: '7.5pt', color: n.textSoft }}>{note}</span>}
      </div>
    </div>
  )
}
```

</details>

### `Sub` · v0.1

| | |
|---|---|
| 语义 | H2 下方的灰色定位句（一句补充，不展开） |
| 何时用 | 紧贴 H2 的补充定位 |
| 何时不用 | 独立段落 → Lead / BodyText |
| 配套 | H2 |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Sub（族 B 标题族）实现该区块。

语义：H2 下方的灰色定位句（一句补充，不展开）
何时用：紧贴 H2 的补充定位
何时不用：独立段落 → Lead / BodyText
配套：H2
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Sub>从序列设计到制剂灌装</Sub>
```

**配置代码**

```jsx
import { Sub } from './src/lib'

<Sub>从序列设计到制剂灌装</Sub>
```

<details><summary>组件源码（primitives.jsx · 8 行）</summary>

```jsx
export function Sub({ children, style }) {
  const n = useNeutral()
  return (
    <div style={{ textAlign: 'center', color: n.text, fontSize: '9.5pt', marginBottom: '5mm', ...style }}>
      {children}
    </div>
  )
}
```

</details>

---

## 族 C · 表格族（6 个）

### `KeyValueTable` · v0.4

| | |
|---|---|
| 语义 | 无列头两列纵排的键值表：左键（tint 底加粗）右值 |
| 何时用 | 产品页左栏的属性→取值清单（选型决策用） |
| 何时不用 | 术语→释义的连续阅读块 → DefinitionList（无底色） |
| 配套 | FigurePanel |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 KeyValueTable（族 C 表格族）实现该区块。

语义：无列头两列纵排的键值表：左键（tint 底加粗）右值
何时用：产品页左栏的属性→取值清单（选型决策用）
何时不用：术语→释义的连续阅读块 → DefinitionList（无底色）
配套：FigurePanel
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<KeyValueTable items={[{ k: '纯度', v: '≥ 95%' }]} />
```

**配置代码**

```jsx
import { KeyValueTable } from './src/lib'

<KeyValueTable items={[{ k: '纯度', v: '≥ 95%' }]} />
```

<details><summary>组件源码（tables.jsx · 29 行）</summary>

```jsx
export function KeyValueTable({ items = [], labelWidth = '32mm', size = '8.5pt', divided = true, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
      fontSize: size, color: n.text, ...style,
    }}>
      <colgroup>
        <col style={{ width: labelWidth }} />
        <col />
      </colgroup>
      <tbody>
        {items.map((it, i) => (
          <tr key={i}>
            <td style={{
              background: t.tint, fontWeight: 700, color: '#333',
              padding: '2.2mm 2.8mm', verticalAlign: 'middle', lineHeight: 1.5,
              borderBottom: divided && i < items.length - 1 ? `0.4pt solid ${n.line}` : 'none',
            }}>{it.k}</td>
            <td style={{
              padding: '2.2mm 3mm', verticalAlign: 'middle', lineHeight: 1.65,
              borderBottom: divided && i < items.length - 1 ? `0.4pt solid ${n.line}` : 'none',
            }}>{renderRich(it.v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

</details>

### `MethodTable` · v0.4

| | |
|---|---|
| 语义 | 方法对照表：左列中文方法名 + 英文缩写分行，右列用途描述 |
| 何时用 | 方法学清单、检测项目清单（技术服务页） |
| 何时不用 | 营销参数 → SpecTable；缩写对照（无描述）→ DefinitionList |
| 配套 | InstrumentReportPanel |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p8「常用分子水平检测方法」 |

**提示词**（直接复制）

```text
用本设计系统的 MethodTable（族 C 表格族）实现该区块。

语义：方法对照表：左列中文方法名 + 英文缩写分行，右列用途描述
何时用：方法学清单、检测项目清单（技术服务页）
何时不用：营销参数 → SpecTable；缩写对照（无描述）→ DefinitionList
配套：InstrumentReportPanel
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<MethodTable rows={[{ cn: '时间分辨荧光', abbr: 'TR-FRET', desc: '结合亲和力检测' }]} />
```

**配置代码**

```jsx
import { MethodTable } from './src/lib'

<MethodTable rows={[{ cn: '时间分辨荧光', abbr: 'TR-FRET', desc: '结合亲和力检测' }]} />
```

<details><summary>组件源码（tables.jsx · 48 行）</summary>

```jsx
export function MethodTable({ rows = [], headers = ['方法', '用途'], nameWidth = '46mm', size = '8.5pt', caption, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ margin: '4mm 0', ...style }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: size, color: n.text }}>
        <colgroup>
          <col style={{ width: nameWidth }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                background: t.tint, textAlign: 'left', verticalAlign: 'middle',
                padding: '2.2mm 2.6mm', fontSize: '8.5pt', fontWeight: 600, color: '#333',
                borderBottom: `0.5pt solid ${t.capsuleLight}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} style={{ background: ri % 2 ? t.zebra : '#fff' }}>
              <td style={{
                padding: '2.4mm 2.6mm', verticalAlign: 'top', lineHeight: 1.5,
                borderBottom: `0.4pt solid ${n.line}`,
              }}>
                <div style={{ fontWeight: 600, color: n.text }}>{r.name}</div>
                {r.en && (
                  <div style={{ fontSize: '7pt', fontWeight: 400, color: n.textSoft, marginTop: '0.7mm' }}>{r.en}</div>
                )}
              </td>
              <td style={{
                padding: '2.4mm 2.6mm', verticalAlign: 'top', lineHeight: 1.65,
                borderBottom: `0.4pt solid ${n.line}`,
              }}>{renderRich(r.desc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <div style={{ fontSize: '7.5pt', fontWeight: 600, color: n.text, textAlign: 'right', marginTop: '2mm' }}>
          {caption}
        </div>
      )}
    </div>
  )
}
```

</details>

### `ProductHeaderRow` · v0.1

| | |
|---|---|
| 语义 | 通栏产品名合并头行（放进 SpecTable 的 rows 里作分段） |
| 何时用 | 大表内按产品分段 |
| 何时不用 | 独立成表；跨页续表头 → 用表头本身 |
| 配套 | SpecTable |
| **来源配色** | **GenScript 手册 p8 五阶段表** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 手册 p8 五阶段表 |

**提示词**（直接复制）

```text
用本设计系统的 ProductHeaderRow（族 C 表格族）实现该区块。

语义：通栏产品名合并头行（放进 SpecTable 的 rows 里作分段）
何时用：大表内按产品分段
何时不用：独立成表；跨页续表头 → 用表头本身
配套：SpecTable
来源配色：GenScript 手册 p8 五阶段表
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ProductHeaderRow title="mRNA 疫苗" colSpan={4} />
```

**配置代码**

```jsx
import { ProductHeaderRow } from './src/lib'

<ProductHeaderRow title="mRNA 疫苗" colSpan={4} />
```

<details><summary>组件源码（tables.jsx · 12 行）</summary>

```jsx
export function ProductHeaderRow({ title, colSpan }) {
  const t = useTheme()
  return (
    <tr>
      <td colSpan={colSpan} style={{
        background: t.header, color: '#fff', fontWeight: 700, textAlign: 'center',
        padding: '2.5mm', fontSize: '9.5pt', borderRadius: 0,
        borderBottom: '1mm solid #fff',
      }}>{title}</td>
    </tr>
  )
}
```

</details>

### `RowLabelMatrixTable` · v0.4

| | |
|---|---|
| 语义 | 行标签矩阵表：行 = 参数（左列 tint 底加粗），列 = 被测产品，列头可挂图 |
| 何时用 | 多产品 × 多参数的横向选型对照 |
| 何时不用 | 逐行读一家的参数清单 → SpecTable（SpecTable 的行是产品，列是参数） |
| 配套 | SpecTable（相邻页互为补充） |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p7「化合物库常规参数」 |

**提示词**（直接复制）

```text
用本设计系统的 RowLabelMatrixTable（族 C 表格族）实现该区块。

语义：行标签矩阵表：行 = 参数（左列 tint 底加粗），列 = 被测产品，列头可挂图
何时用：多产品 × 多参数的横向选型对照
何时不用：逐行读一家的参数清单 → SpecTable（SpecTable 的行是产品，列是参数）
配套：SpecTable（相邻页互为补充）
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<RowLabelMatrixTable columns={[{ label: 'A 产品' }]} rows={[{ label: '粒径', cells: ['92 nm'] }]} />
```

**配置代码**

```jsx
import { RowLabelMatrixTable } from './src/lib'

<RowLabelMatrixTable columns={[{ label: 'A 产品' }]} rows={[{ label: '粒径', cells: ['92 nm'] }]} />
```

<details><summary>组件源码（tables.jsx · 4 行）</summary>

```jsx
export function RowLabelMatrixTable({
  labelHeader = '', labelWidth = '34mm', columns = [], rows = [],
  fontSize = '8pt', divider = false, style,
}
```

</details>

### `SpecTable` · v0.1

| | |
|---|---|
| 语义 | 实底反白表头的参数表（营销语体），R5 无竖线 + 斑马纹 |
| 何时用 | 卖点、档位、承诺数字、产品参数（营销语境） |
| 何时不用 | 技术检测数据 → InstrumentReportPanel（R16 两种语体不可混页） |
| 配套 | ProductHeaderRow, TierMatrixTable |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R5 / R8 |

**提示词**（直接复制）

```text
用本设计系统的 SpecTable（族 C 表格族）实现该区块。

语义：实底反白表头的参数表（营销语体），R5 无竖线 + 斑马纹
何时用：卖点、档位、承诺数字、产品参数（营销语境）
何时不用：技术检测数据 → InstrumentReportPanel（R16 两种语体不可混页）
配套：ProductHeaderRow, TierMatrixTable
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<SpecTable columns={['项目', '规格']} rows={[['粒径', '80–120 nm']]} labelColumn />
```

**配置代码**

```jsx
import { SpecTable } from './src/lib'

<SpecTable columns={['项目', '规格']} rows={[['粒径', '80–120 nm']]} labelColumn />
```

<details><summary>组件源码（tables.jsx · 44 行）</summary>

```jsx
export function SpecTable({ columns, rows, labelColumn = false, zebra = true, fontSize = '8.5pt', style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <table style={{
      width: '100%', borderCollapse: 'separate', borderSpacing: 0,
      fontSize, color: n.text, ...style,
    }}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={{
              background: t.header, color: '#fff', fontWeight: 700, fontSize: '9pt',
              padding: '2.8mm 2mm', textAlign: 'center', lineHeight: 1.35,
              borderRight: i < columns.length - 1 ? '1mm solid #fff' : 'none',
              borderTopLeftRadius: i === 0 ? '2.5mm' : 0,
              borderTopRightRadius: i === columns.length - 1 ? '2.5mm' : 0,
            }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => {
              if (cell === null) return null
              const c = typeof cell === 'object' ? cell : { v: cell }
              const isLabel = labelColumn && ci === 0
              return (
                <td key={ci} rowSpan={c.rowSpan} colSpan={c.colSpan} style={{
                  padding: '2.2mm 2.5mm', textAlign: isLabel ? 'center' : (c.align || 'center'),
                  verticalAlign: 'middle', lineHeight: 1.5,
                  background: c.highlight ? t.tint : isLabel ? t.zebra : zebra && ri % 2 === 1 ? t.zebra : '#fff',
                  borderBottom: `0.5pt solid ${n.line}`,
                  fontWeight: c.bold || isLabel ? 700 : 400,
                  color: c.highlight ? t.functional : c.bold || isLabel ? '#333' : n.text,
                }}>{c.v}</td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

</details>

### `TierMatrixTable` · v0.1

| | |
|---|---|
| 语义 | 三档色阶矩阵表：列头同色系深浅递进（深浅 = 承诺强度） |
| 何时用 | RUO / IND / cGMP 这类档位 × 特性的对照 |
| 何时不用 | 单档参数清单 → SpecTable；三档套餐报价 → TierCards |
| 配套 | SpecTable |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R6 |

**提示词**（直接复制）

```text
用本设计系统的 TierMatrixTable（族 C 表格族）实现该区块。

语义：三档色阶矩阵表：列头同色系深浅递进（深浅 = 承诺强度）
何时用：RUO / IND / cGMP 这类档位 × 特性的对照
何时不用：单档参数清单 → SpecTable；三档套餐报价 → TierCards
配套：SpecTable
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TierMatrixTable tiers={['RUO', 'IND', 'cGMP']} features={[{ name: '方法学验证', values: [false, true, true] }]} />
```

**配置代码**

```jsx
import { TierMatrixTable } from './src/lib'

<TierMatrixTable tiers={['RUO', 'IND', 'cGMP']} features={[{ name: '方法学验证', values: [false, true, true] }]} />
```

<details><summary>组件源码（tables.jsx · 36 行）</summary>

```jsx
export function TierMatrixTable({ tiers, features, check = '✓', cross = '—' }) {
  const t = useTheme(); const n = useNeutral()
  const shades = [t.capsuleLight, t.header, t.functional, t.capsuleDeep]
  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '8.5pt', color: n.text }}>
      <thead>
        <tr>
          <th style={{ width: '26%', background: 'transparent' }} />
          {tiers.map((name, i) => (
            <th key={i} style={{
              background: shades[Math.min(i, shades.length - 1)], color: '#fff', fontWeight: 700,
              padding: '2.8mm 2mm', textAlign: 'center',
              borderRight: i < tiers.length - 1 ? '1mm solid #fff' : 'none',
              borderTopLeftRadius: i === 0 ? '2.5mm' : 0,
              borderTopRightRadius: i === tiers.length - 1 ? '2.5mm' : 0,
            }}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((f, ri) => (
          <tr key={ri}>
            <td style={{ padding: '2.2mm 2.5mm', fontWeight: 700, color: '#333', borderBottom: `0.5pt solid ${n.line}`, background: ri % 2 ? t.zebra : '#fff' }}>{f.name}</td>
            {f.values.map((v, ci) => (
              <td key={ci} style={{
                textAlign: 'center', borderBottom: `0.5pt solid ${n.line}`,
                background: ri % 2 ? t.zebra : '#fff',
                color: v === true ? t.functional : n.textSoft, fontWeight: v === true ? 700 : 400,
              }}>{v === true ? check : v === false ? cross : v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

</details>

---

## 族 D · 卡片族（7 个）

### `ConclusionBanner` · v0.1

| | |
|---|---|
| 语义 | 通栏全圆胶囊结论横幅（solid 版即 CTA） |
| 何时用 | 页末结论收口；单点转化 |
| 何时不用 | 页中的过程性提醒 → NoteBand |
| 配套 | NoteBand |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 ConclusionBanner（族 D 卡片族）实现该区块。

语义：通栏全圆胶囊结论横幅（solid 版即 CTA）
何时用：页末结论收口；单点转化
何时不用：页中的过程性提醒 → NoteBand
配套：NoteBand
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ConclusionBanner tone="tint">把质控前置，是缩短 IND 周期的唯一办法。</ConclusionBanner>
```

**配置代码**

```jsx
import { ConclusionBanner } from './src/lib'

<ConclusionBanner tone="tint">把质控前置，是缩短 IND 周期的唯一办法。</ConclusionBanner>
```

<details><summary>组件源码（cards.jsx · 14 行）</summary>

```jsx
export function ConclusionBanner({ children, tone = 'tint', style }) {
  const t = useTheme()
  const solid = tone === 'solid'
  return (
    <div style={{ textAlign: 'center', margin: '5mm 0' }}>
      <div style={{
        display: 'inline-block', borderRadius: '999px',
        background: solid ? t.functional : t.tint,
        color: solid ? '#fff' : '#333',
        fontWeight: 600, fontSize: '10pt', padding: '4mm 12mm', lineHeight: 1.5, ...style,
      }}>{children}</div>
    </div>
  )
}
```

</details>

### `MetricStrip` · v0.4

| | |
|---|---|
| 语义 | 大数字指标条：靠上下两条 0.4pt 细线框住，项间竖线分隔，无图标无底 |
| 何时用 | 「数字前置」的紧凑数据组；首屏优势条 |
| 何时不用 | 带图标与描述的卖点卡 → StatCardRow |
| 配套 | TargetBarChart |
| **来源配色** | **MCE 各册首屏优势条 · 随册主题** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 各册首屏优势条（数值形态）· v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 MetricStrip（族 D 卡片族）实现该区块。

语义：大数字指标条：靠上下两条 0.4pt 细线框住，项间竖线分隔，无图标无底
何时用：「数字前置」的紧凑数据组；首屏优势条
何时不用：带图标与描述的卖点卡 → StatCardRow
配套：TargetBarChart
来源配色：MCE 各册首屏优势条 · 随册主题
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<MetricStrip items={[{ value: '60,000+', unit: '种', label: '活性化合物' }]} />
```

**配置代码**

```jsx
import { MetricStrip } from './src/lib'

<MetricStrip items={[{ value: '60,000+', unit: '种', label: '活性化合物' }]} />
```

<details><summary>组件源码（cards.jsx · 30 行）</summary>

```jsx
export function MetricStrip({ items = [], columns, accent = true, style }) {
  const t = useTheme(); const n = useNeutral()
  const cols = columns || Math.max(items.length, 1)
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
      borderTop: `0.4pt solid ${n.line}`, borderBottom: `0.4pt solid ${n.line}`,
      margin: '4mm 0', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: '3.6mm 3mm', textAlign: 'center',
          borderLeft: i > 0 ? `0.4pt solid ${n.line}` : 'none',
        }}>
          <div style={{
            fontSize: '19pt', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.4px',
            color: accent ? t.functional : '#333', fontVariantNumeric: 'tabular-nums',
          }}>
            {it.value}
            {it.unit && <span style={{ fontSize: '9pt', fontWeight: 600, marginLeft: '0.8mm' }}>{it.unit}</span>}
          </div>
          <div style={{ fontSize: '8pt', color: n.text, marginTop: '1.8mm', lineHeight: 1.5 }}>{it.label}</div>
          {it.en && (
            <div style={{ fontSize: '6.5pt', color: n.textSoft, marginTop: '0.6mm', lineHeight: 1.4 }}>{it.en}</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

</details>

### `ProductCardGrid` · v0.4

| | |
|---|---|
| 语义 | 产品/服务卡网格：顶部类目条 + 目录号 + 产品名 + 描述（行内加粗） |
| 何时用 | 产品明细页的主力版式 |
| 何时不用 | 逐行参数对照 → SpecTable / RowLabelMatrixTable |
| 配套 | BarTitle, FigCaption |
| **来源配色** | **MCE PROTAC 手册 深紫 #5A3A7D（类目条玫红 #DC5973）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-protac` · PROTAC 深紫（主色 `#5A3A7D`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE PROTAC p5「Ligands for Target Proteins for PROTACs」 |

**提示词**（直接复制）

```text
用本设计系统的 ProductCardGrid（族 D 卡片族）实现该区块。

语义：产品/服务卡网格：顶部类目条 + 目录号 + 产品名 + 描述（行内加粗）
何时用：产品明细页的主力版式
何时不用：逐行参数对照 → SpecTable / RowLabelMatrixTable
配套：BarTitle, FigCaption
来源配色：MCE PROTAC 手册 深紫 #5A3A7D（类目条玫红 #DC5973）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-protac（PROTAC 深紫 · 主色 #5A3A7D）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ProductCardGrid items={[{ category: 'Kinases', code: 'YT-1021', name: 'EGFR 抑制剂', desc: '**靶点** 明确' }]} />
```

**配置代码**

```jsx
import { ProductCardGrid } from './src/lib'

<ProductCardGrid items={[{ category: 'Kinases', code: 'YT-1021', name: 'EGFR 抑制剂', desc: '**靶点** 明确' }]} />
```

<details><summary>组件源码（cards.jsx · 54 行）</summary>

```jsx
export function ProductCardGrid({ items = [], columns = 3, palette = 'tone', headerTone = 'solid', gap = '4mm', style }) {
  const t = useTheme(); const n = useNeutral()
  const ramps = pastelRamp(t.functional, Math.max(items.length, 1), { spread: palette === 'category' ? 1 : 0 })
  const solid = headerTone === 'solid'
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap, margin: '4mm 0', ...style,
    }}>
      {items.map((it, i) => {
        const r = ramps[i % ramps.length]
        return (
          <div key={i} style={{
            border: `0.5pt solid ${n.line}`, borderRadius: '1.2mm', borderTopRightRadius: '6mm',
            overflow: 'hidden', background: '#fff', breakInside: 'avoid',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2mm',
              background: solid ? r.base : r.bg, color: solid ? '#fff' : r.fg,
              fontWeight: 700, fontSize: '8.5pt', lineHeight: 1.35, padding: '2.2mm 3.6mm',
            }}>
              <span>{it.category}</span>
              {/* 几何小方块：类目条的"品牌记号"，两枚深浅递减 */}
              <span style={{ display: 'inline-flex', gap: '1.2mm', alignItems: 'center', flexShrink: 0 }}>
                <span style={{
                  width: '2mm', height: '2mm', borderRadius: '0.4mm',
                  background: solid ? 'rgba(255,255,255,0.62)' : r.base,
                }} />
                <span style={{
                  width: '2mm', height: '2mm', borderRadius: '0.4mm',
                  background: solid ? 'rgba(255,255,255,0.32)' : mixAlpha(r.base),
                }} />
              </span>
            </div>
            <div style={{ padding: '3.2mm 3.6mm 3.6mm' }}>
              {it.code && (
                <div style={{ fontSize: '7.5pt', color: n.textSoft, lineHeight: 1.4 }}>{it.code}</div>
              )}
              <div style={{
                fontSize: '10pt', fontWeight: 600, color: t.functional, lineHeight: 1.35, margin: '1mm 0 1.8mm',
              }}>{it.name}</div>
              {it.en && (
                <div style={{ fontSize: '7pt', fontWeight: 300, color: n.textSoft, marginBottom: '1.4mm' }}>{it.en}</div>
              )}
              {it.desc && (
                <div style={{ fontSize: '8pt', color: n.text, lineHeight: 1.62 }}>{renderRich(it.desc)}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

</details>

### `StatCardRow` · v0.1

| | |
|---|---|
| 语义 | 一行 3–4 张等宽卖点卡（图标 + 标题 + 描述，tint→zebra 渐变底） |
| 何时用 | 首屏卖点、能力概览 |
| 何时不用 | 纯数字指标组 → MetricStrip（MetricStrip 无图标无底） |
| 配套 | PillTitle, Lead |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R6 |

**提示词**（直接复制）

```text
用本设计系统的 StatCardRow（族 D 卡片族）实现该区块。

语义：一行 3–4 张等宽卖点卡（图标 + 标题 + 描述，tint→zebra 渐变底）
何时用：首屏卖点、能力概览
何时不用：纯数字指标组 → MetricStrip（MetricStrip 无图标无底）
配套：PillTitle, Lead
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<StatCardRow items={[{ icon: 'flask', title: '一站式', desc: '质粒到 LNP' }]} />
```

**配置代码**

```jsx
import { StatCardRow } from './src/lib'

<StatCardRow items={[{ icon: 'flask', title: '一站式', desc: '质粒到 LNP' }]} />
```

<details><summary>组件源码（cards.jsx · 17 行）</summary>

```jsx
export function StatCardRow({ items }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ display: 'flex', gap: '5mm', margin: '4mm 0' }}>
      {items.map((c, i) => (
        <div key={i} style={{
          flex: 1, ...SCOOP, padding: '5.5mm 4mm 5mm', textAlign: 'center',
          background: `linear-gradient(to bottom, ${t.tint}, ${t.zebra})`,
        }}>
          {c.icon && <Icon name={c.icon} size={30} style={{ marginBottom: '2.5mm' }} />}
          <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#333', lineHeight: 1.35, marginBottom: '1.5mm' }}>{c.title}</div>
          <div style={{ fontSize: '8pt', color: n.textSoft, lineHeight: 1.5 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  )
}
```

</details>

### `TestimonialCard` · v0.1

| | |
|---|---|
| 语义 | 客户证言卡（渐变面板 + 超大引号 + 头像 + 虚线分隔） |
| 何时用 | 客户评价与背书 |
| 何时不用 | 案例的完整叙述（难点/方案/结果）→ CaseBlock |
| 配套 | CitationBlock |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 TestimonialCard（族 D 卡片族）实现该区块。

语义：客户证言卡（渐变面板 + 超大引号 + 头像 + 虚线分隔）
何时用：客户评价与背书
何时不用：案例的完整叙述（难点/方案/结果）→ CaseBlock
配套：CitationBlock
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TestimonialCard quote="交付节奏比预期快两周。" name="张博士" org="某生物技术公司" />
```

**配置代码**

```jsx
import { TestimonialCard } from './src/lib'

<TestimonialCard quote="交付节奏比预期快两周。" name="张博士" org="某生物技术公司" />
```

<details><summary>组件源码（cards.jsx · 27 行）</summary>

```jsx
export function TestimonialCard({ quote, name, org, avatar }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      ...SCOOP, borderTopRightRadius: '14mm', position: 'relative',
      background: `linear-gradient(to bottom, ${t.tint}, #fff)`,
      padding: '10mm 8mm 7mm', margin: '4mm 0',
    }}>
      <div style={{ position: 'absolute', top: '4mm', left: '6mm', fontSize: '34pt', color: t.functional, fontFamily: 'Georgia, serif', lineHeight: 1 }}>“</div>
      <div style={{ position: 'absolute', bottom: '18mm', right: '6mm', fontSize: '34pt', color: t.functional, fontFamily: 'Georgia, serif', lineHeight: 1 }}>”</div>
      <p style={{ fontSize: '9.5pt', color: '#333', lineHeight: 1.8, fontStyle: 'italic', margin: '0 8mm 6mm' }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4mm', borderTop: `0.75pt dashed ${t.header}`, paddingTop: '4mm' }}>
        <div style={{
          width: '11mm', height: '11mm', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          background: t.header, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '11pt',
        }}>
          {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (name || '?')[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '9.5pt', color: '#333' }}>{name}</div>
          <div style={{ fontSize: '8.5pt', color: n.textSoft }}>{org}</div>
        </div>
      </div>
    </div>
  )
}
```

</details>

### `TierCards` · v0.1

| | |
|---|---|
| 语义 | 三档套餐卡（顶部实色条 + 主题色「周期，价格」） |
| 何时用 | 套餐报价与交付周期 |
| 何时不用 | 特性 × 档位对照矩阵 → TierMatrixTable |
| 配套 | SpecTable |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R6 |

**提示词**（直接复制）

```text
用本设计系统的 TierCards（族 D 卡片族）实现该区块。

语义：三档套餐卡（顶部实色条 + 主题色「周期，价格」）
何时用：套餐报价与交付周期
何时不用：特性 × 档位对照矩阵 → TierMatrixTable
配套：SpecTable
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TierCards tiers={[{ name: '标准', cycle: '4 周', price: '¥ 面议' }]} />
```

**配置代码**

```jsx
import { TierCards } from './src/lib'

<TierCards tiers={[{ name: '标准', cycle: '4 周', price: '¥ 面议' }]} />
```

<details><summary>组件源码（cards.jsx · 23 行）</summary>

```jsx
export function TierCards({ tiers, footnote }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div>
      <div style={{ display: 'flex', gap: '5mm', margin: '4mm 0 2mm' }}>
        {tiers.map((p, i) => (
          <div key={i} style={{ flex: 1, ...SCOOP, overflow: 'hidden', border: `0.75pt solid ${t.header}` }}>
            <div style={{ background: t.header, color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: '10.5pt', padding: '3mm 2mm' }}>
              {p.name}
            </div>
            <div style={{ padding: '4.5mm 5mm', textAlign: 'center' }}>
              <div style={{ color: t.functional, fontWeight: 700, fontSize: '10.5pt', marginBottom: '2mm' }}>
                {p.cycle}，{p.price}
              </div>
              <div style={{ fontSize: '8.5pt', color: n.text, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {footnote && <div style={{ color: n.textSoft, fontSize: '7.5pt', lineHeight: 1.6 }}>{footnote}</div>}
    </div>
  )
}
```

</details>

### `TocList` · v0.4

| | |
|---|---|
| 语义 | 目录条目：编号 + 标题 + 英文副题 + 点线引至页码（点线用 dotted 边框，非重复字符） |
| 何时用 | 20 页以上手册的目录页 |
| 何时不用 | 章节页导览（带分组标题的岛）→ IslandBulletGrid |
| 配套 | NumberedTitle |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 TocList（族 D 卡片族）实现该区块。

语义：目录条目：编号 + 标题 + 英文副题 + 点线引至页码（点线用 dotted 边框，非重复字符）
何时用：20 页以上手册的目录页
何时不用：章节页导览（带分组标题的岛）→ IslandBulletGrid
配套：NumberedTitle
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TocList items={[{ no: '01', title: '服务总览', en: 'Overview', page: 4 }]} />
```

**配置代码**

```jsx
import { TocList } from './src/lib'

<TocList items={[{ no: '01', title: '服务总览', en: 'Overview', page: 4 }]} />
```

<details><summary>组件源码（cards.jsx · 40 行）</summary>

```jsx
export function TocList({ items = [], columns = 2, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '10mm' : undefined,
      margin: '4mm 0', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline', gap: '2.2mm',
          breakInside: 'avoid', marginBottom: it.level === 2 ? '1.8mm' : '2.6mm',
          paddingLeft: it.level === 2 ? '5mm' : 0,
        }}>
          {it.no && (
            <span style={{
              flexShrink: 0, minWidth: '6mm', fontSize: '8.5pt', fontWeight: 700,
              color: t.functional, fontVariantNumeric: 'tabular-nums',
            }}>{it.no}</span>
          )}
          <span style={{ flexShrink: 0 }}>
            <span style={{
              fontSize: it.level === 2 ? '8.5pt' : '9pt', fontWeight: it.level === 2 ? 400 : 600, color: '#333',
            }}>{it.title}</span>
            {it.en && (
              <span style={{ fontSize: '7pt', fontWeight: 300, color: n.textSoft, marginLeft: '2.2mm' }}>{it.en}</span>
            )}
          </span>
          <span style={{
            flex: 1, minWidth: '5mm', borderBottom: `0.4pt dotted ${n.ghost}`, transform: 'translateY(-1mm)',
          }} />
          <span style={{
            flexShrink: 0, fontSize: '8.5pt', fontWeight: 600, color: n.text,
            fontVariantNumeric: 'tabular-nums',
          }}>{it.page}</span>
        </div>
      ))}
    </div>
  )
}
```

</details>

---

## 族 E · 流程族（4 个）

### `ChevronFlow` · v0.1

| | |
|---|---|
| 语义 | 燕尾咬合箭头带（variant=funnel 时反向渐变表达漏斗） |
| 何时用 | 阶段推进；轻量漏斗 |
| 何时不用 | 多入口汇聚的网络 → ServiceNetworkMap；量化收敛漏斗 → FunnelStages |
| 配套 | PhaseBand |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 ChevronFlow（族 E 流程族）实现该区块。

语义：燕尾咬合箭头带（variant=funnel 时反向渐变表达漏斗）
何时用：阶段推进；轻量漏斗
何时不用：多入口汇聚的网络 → ServiceNetworkMap；量化收敛漏斗 → FunnelStages
配套：PhaseBand
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ChevronFlow steps={['初筛', '复筛', '验证']} variant="funnel" />
```

**配置代码**

```jsx
import { ChevronFlow } from './src/lib'

<ChevronFlow steps={['初筛', '复筛', '验证']} variant="funnel" />
```

<details><summary>组件源码（flow.jsx · 22 行）</summary>

```jsx
export function ChevronFlow({ steps, variant = 'process' }) {
  const t = useTheme()
  return (
    <div style={{ display: 'flex', margin: '4mm 0' }}>
      {steps.map((s, i) => {
        const color = variant === 'funnel'
          ? t.ramp[Math.min(t.ramp.length - 1 - i, t.ramp.length - 1)]
          : t.ramp[Math.min(i, t.ramp.length - 1)]
        return (
          <div key={i} style={{
            flex: 1, background: color, color: '#fff', fontWeight: 700, fontSize: '9pt',
            textAlign: 'center', padding: '3.5mm 2mm 3.5mm 4mm',
            clipPath: i === 0
              ? 'polygon(0 0, calc(100% - 5mm) 0, 100% 50%, calc(100% - 5mm) 100%, 0 100%)'
              : 'polygon(0 0, calc(100% - 5mm) 0, 100% 50%, calc(100% - 5mm) 100%, 0 100%, 5mm 50%)',
            marginLeft: i === 0 ? 0 : '-2mm',
          }}>{s}</div>
        )
      })}
    </div>
  )
}
```

</details>

### `FlowChain` · v0.1

| | |
|---|---|
| 语义 | 白框 + 顶部实色条 + › 连接的流程框链（正统、正式的交付阶段） |
| 何时用 | 交付阶段 / 服务流程；需要「正式感」时 |
| 何时不用 | 实验步骤（要更亲和）→ NumberedStepFlow；注意 R9：流程下必须跟 TimelineBar |
| 配套 | TimelineBar（R9 必配）, TimelineBar 之后可接 StagePipelineChain |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R9 |

**提示词**（直接复制）

```text
用本设计系统的 FlowChain（族 E 流程族）实现该区块。

语义：白框 + 顶部实色条 + › 连接的流程框链（正统、正式的交付阶段）
何时用：交付阶段 / 服务流程；需要「正式感」时
何时不用：实验步骤（要更亲和）→ NumberedStepFlow；注意 R9：流程下必须跟 TimelineBar
配套：TimelineBar（R9 必配）, TimelineBar 之后可接 StagePipelineChain
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<FlowChain steps={[{ name: '序列设计', cycle: '3 天', desc: '密码子优化' }]} numbered />
```

**配置代码**

```jsx
import { FlowChain } from './src/lib'

<FlowChain steps={[{ name: '序列设计', cycle: '3 天', desc: '密码子优化' }]} numbered />
```

<details><summary>组件源码（flow.jsx · 38 行）</summary>

```jsx
export function FlowChain({ steps, numbered = false }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: '2.5mm', margin: '4mm 0' }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <div style={{
            flex: 1, background: '#fff', border: `0.75pt solid ${t.header}`,
            borderRadius: '2.5mm', borderTopRightRadius: '7mm', overflow: 'hidden', height: '100%',
          }}>
            <div style={{
              background: t.header, color: '#fff', fontWeight: 700, fontSize: '9.5pt',
              textAlign: 'center', padding: '2.6mm 2mm',
            }}>
              {numbered ? `${i + 1}. ` : ''}{s.name}
            </div>
            <div style={{ padding: '3.5mm 3.5mm 3mm' }}>
              {s.cycle && (
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '9pt', color: '#333', marginBottom: '1.5mm' }}>
                  （{s.cycle}）
                </div>
              )}
              <div style={{ fontSize: '8pt', color: n.text, lineHeight: 1.55, textAlign: 'center', marginBottom: s.bullets ? '2mm' : 0 }}>{s.desc}</div>
              {s.bullets && s.bullets.map((b, j) => (
                <div key={j} style={{ fontSize: '7.5pt', color: n.text, lineHeight: 1.55 }}>
                  <span style={{ color: t.functional, marginRight: '1mm' }}>•</span>{b}
                </div>
              ))}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ color: t.functional, fontWeight: 800, fontSize: '13pt', padding: '0 1.5mm', flexShrink: 0 }}>›</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

</details>

### `IconFlowBar` · v0.1

| | |
|---|---|
| 语义 | 细描边大容器 + 面性图标横排（轻量流程 / 能力横排） |
| 何时用 | 轻量的能力或阶段横排 |
| 何时不用 | 并列相加（无方向）→ HexChain（HexChain 用 ⊕，本组件用 ›） |
| 配套 | IconFeatureList |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 IconFlowBar（族 E 流程族）实现该区块。

语义：细描边大容器 + 面性图标横排（轻量流程 / 能力横排）
何时用：轻量的能力或阶段横排
何时不用：并列相加（无方向）→ HexChain（HexChain 用 ⊕，本组件用 ›）
配套：IconFeatureList
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<IconFlowBar steps={[{ icon: 'dna', name: '序列设计' }]} />
```

**配置代码**

```jsx
import { IconFlowBar } from './src/lib'

<IconFlowBar steps={[{ icon: 'dna', name: '序列设计' }]} />
```

<details><summary>组件源码（flow.jsx · 21 行）</summary>

```jsx
export function IconFlowBar({ steps }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      border: `0.75pt solid ${t.header}`, borderRadius: '3mm', borderTopRightRadius: '9mm',
      padding: '5mm 4mm', display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '4mm 0',
    }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', width: '24mm' }}>
            <Icon name={s.icon} size={28} style={{ marginBottom: '1.5mm' }} />
            <div style={{ fontSize: '8pt', color: n.text, lineHeight: 1.4 }}>{s.name}</div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ color: t.header, fontWeight: 800, fontSize: '12pt', margin: '0 1mm' }}>›</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

</details>

### `TimelineBar` · v0.1

| | |
|---|---|
| 语义 | 时间轴：段宽 ∝ 时长，ramp 色带递进 + 通栏箭头 + 黑粗总周期 |
| 何时用 | 流程页的时间承诺（R9：流程下必跟） |
| 何时不用 | 纯顺序但无时长 → FlowChain；阶段归档（时间轴上的位置）→ PhaseBand |
| 配套 | FlowChain |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R9 |

**提示词**（直接复制）

```text
用本设计系统的 TimelineBar（族 E 流程族）实现该区块。

语义：时间轴：段宽 ∝ 时长，ramp 色带递进 + 通栏箭头 + 黑粗总周期
何时用：流程页的时间承诺（R9：流程下必跟）
何时不用：纯顺序但无时长 → FlowChain；阶段归档（时间轴上的位置）→ PhaseBand
配套：FlowChain
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TimelineBar segments={[{ label: '设计', weeks: 1 }, { label: '合成', weeks: 1.5 }]} total="快至 2.5 周交付" />
```

**配置代码**

```jsx
import { TimelineBar } from './src/lib'

<TimelineBar segments={[{ label: '设计', weeks: 1 }, { label: '合成', weeks: 1.5 }]} total="快至 2.5 周交付" />
```

<details><summary>组件源码（flow.jsx · 27 行）</summary>

```jsx
export function TimelineBar({ segments, total }) {
  const t = useTheme()
  const sum = segments.reduce((a, s) => a + s.weeks, 0)
  return (
    <div style={{ margin: '3mm 0 4mm' }}>
      <div style={{ display: 'flex', borderRadius: '999px', overflow: 'hidden' }}>
        {segments.map((s, i) => (
          <div key={i} style={{
            width: `${(s.weeks / sum) * 100}%`, textAlign: 'center',
            background: t.ramp[Math.min(i, t.ramp.length - 1)],
            color: '#fff', fontWeight: 700, fontSize: '8.5pt', padding: '2mm 0',
            borderRight: i < segments.length - 1 ? '0.75mm solid #fff' : 'none',
          }}>{s.label}</div>
        ))}
      </div>
      <div style={{ position: 'relative', height: '7mm', marginTop: '1mm' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 100 10">
          <line x1="0" y1="5" x2="97" y2="5" stroke={t.capsuleDeep} strokeWidth="1.6" />
          <path d="M97 1 L100 5 L97 9 Z" fill={t.capsuleDeep} />
        </svg>
      </div>
      {total && (
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '10.5pt', color: '#333' }}>{total}</div>
      )}
    </div>
  )
}
```

</details>

---

## 族 F · 案例与证据族（3 个）

### `CaseBlock` · v0.1

| | |
|---|---|
| 语义 | 案例三段式（技术难点 / 解决方案 / 结果），纯排版无底色 |
| 何时用 | 客户案例页 |
| 何时不用 | 客户评价背书 → TestimonialCard |
| 配套 | EvidenceGrid, MetricStrip |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 CaseBlock（族 F 案例与证据族）实现该区块。

语义：案例三段式（技术难点 / 解决方案 / 结果），纯排版无底色
何时用：客户案例页
何时不用：客户评价背书 → TestimonialCard
配套：EvidenceGrid, MetricStrip
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<CaseBlock title="难表达蛋白的 mRNA 优化" facts={[{ k: '技术难点', v: 'GC 含量过高' }]} />
```

**配置代码**

```jsx
import { CaseBlock } from './src/lib'

<CaseBlock title="难表达蛋白的 mRNA 优化" facts={[{ k: '技术难点', v: 'GC 含量过高' }]} />
```

<details><summary>组件源码（case.jsx · 13 行）</summary>

```jsx
export function CaseBlock({ title, facts }) {
  const n = useNeutral()
  return (
    <div style={{ margin: '4mm 0' }}>
      <div style={{ fontWeight: 700, fontSize: '10pt', color: '#333', marginBottom: '2mm' }}>{title}</div>
      {facts.map((f, i) => (
        <div key={i} style={{ fontSize: '9pt', lineHeight: 1.7, color: n.text, marginBottom: '1.2mm', textAlign: 'justify' }}>
          <b style={{ color: '#333' }}>{f.k}：</b>{f.v}
        </div>
      ))}
    </div>
  )
}
```

</details>

### `DataChart` · v0.1

| | |
|---|---|
| 语义 | 柱状图双系列（浅档 capsuleLight + 深档 functional，control 走橙） |
| 何时用 | 两组对比（A/B 或优化前后） |
| 何时不用 | 单序列排行 → TargetBarChart；多面板小倍数 → PanelBarChart |
| 配套 | FunnelStages |
| **来源配色** | **GenScript · 双系列（浅档 capsuleLight + 深档 functional），对照橙 #E8963C** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 DataChart（族 F 案例与证据族）实现该区块。

语义：柱状图双系列（浅档 capsuleLight + 深档 functional，control 走橙）
何时用：两组对比（A/B 或优化前后）
何时不用：单序列排行 → TargetBarChart；多面板小倍数 → PanelBarChart
配套：FunnelStages
来源配色：GenScript · 双系列（浅档 capsuleLight + 深档 functional），对照橙 #E8963C
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<DataChart groups={[{ label: 'L1', a: 62, b: 88 }]} seriesNames={['未优化', '优化后']} unit="%" />
```

**配置代码**

```jsx
import { DataChart } from './src/lib'

<DataChart groups={[{ label: 'L1', a: 62, b: 88 }]} seriesNames={['未优化', '优化后']} unit="%" />
```

<details><summary>组件源码（case.jsx · 39 行）</summary>

```jsx
export function DataChart({ title, groups, max = 100, unit = '%', seriesNames = ['组 A', '组 B'] }) {
  const t = useTheme(); const n = useNeutral()
  const W = 720, H = 230, padL = 44, padB = 34, padT = 14
  const plotW = W - padL - 16, plotH = H - padT - padB
  const barW = Math.min(14, (plotW / groups.length - 10) / 2)
  const y = (v) => padT + plotH - (v / max) * plotH
  return (
    <div style={{ margin: '3mm 0' }}>
      {title && <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '9pt', color: '#333', marginBottom: '1.5mm' }}>{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={padL} y1={y(max * f)} x2={W - 16} y2={y(max * f)} stroke="#E5E5E5" strokeWidth="1" />
            <text x={padL - 6} y={y(max * f) + 3.5} fontSize="9" fill={n.textSoft} textAnchor="end">{max * f}{unit}</text>
          </g>
        ))}
        {groups.map((g, i) => {
          const cx = padL + (plotW / groups.length) * (i + 0.5)
          const hasB = g.b != null
          return (
            <g key={i}>
              <rect x={cx - (hasB ? barW + 1 : barW / 2)} y={y(g.a)} width={barW} height={plotH + padT - y(g.a)}
                fill={g.control ? n.control : t.capsuleLight} />
              {hasB && (
                <rect x={cx + 1} y={y(g.b)} width={barW} height={plotH + padT - y(g.b)}
                  fill={t.functional} />
              )}
              <text x={cx} y={H - padB + 13} fontSize="8.5" fill={n.text} textAnchor="middle">{g.label}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6mm', fontSize: '7.5pt', color: n.textSoft, marginTop: '1mm' }}>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: t.capsuleLight, marginRight: 4 }} />{seriesNames[0]}</span>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: t.functional, marginRight: 4 }} />{seriesNames[1]}</span>
      </div>
    </div>
  )
}
```

</details>

### `EvidenceGrid` · v0.1

| | |
|---|---|
| 语义 | 原始实验图直角平铺（可加绿色虚线圈选） |
| 何时用 | 原始数据图作为证据（免疫荧光、电泳等） |
| 何时不用 | 精修示意图 / 通路图 → FigurePanel / LegendFigure |
| 配套 | CaseBlock, FigCaption |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 EvidenceGrid（族 F 案例与证据族）实现该区块。

语义：原始实验图直角平铺（可加绿色虚线圈选）
何时用：原始数据图作为证据（免疫荧光、电泳等）
何时不用：精修示意图 / 通路图 → FigurePanel / LegendFigure
配套：CaseBlock, FigCaption
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<EvidenceGrid images={[{ src: '/assets/if_1.png', caption: '图 1  免疫荧光' }]} cols={3} />
```

**配置代码**

```jsx
import { EvidenceGrid } from './src/lib'

<EvidenceGrid images={[{ src: '/assets/if_1.png', caption: '图 1  免疫荧光' }]} cols={3} />
```

<details><summary>组件源码（case.jsx · 26 行）</summary>

```jsx
export function EvidenceGrid({ images, note, highlight, cols }) {
  const n = useNeutral()
  return (
    <div style={{ margin: '3mm 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || images.length}, 1fr)`, gap: '4mm' }}>
        {images.map((im, i) => (
          <div key={i}>
            {im.caption && <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '8.5pt', color: '#333', marginBottom: '1.5mm' }}>{im.caption}</div>}
            <div style={{ position: 'relative' }}>
              <img src={im.src} alt="" style={{ width: '100%', display: 'block' }} />
              {highlight && highlight.imgIndex === i && (
                <div style={{
                  position: 'absolute',
                  left: `${highlight.x}%`, top: `${highlight.y}%`,
                  width: `${highlight.w}%`, height: `${highlight.h}%`,
                  border: '1.5pt dashed #2FA84F', boxSizing: 'border-box',
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
      {note && <div style={{ textAlign: 'center', color: n.textSoft, fontSize: '8pt', marginTop: '2mm' }}>{note}</div>}
    </div>
  )
}
```

</details>

---

## 族 G · 页面骨架与图标（3 个）

### `CapsuleDecor` · v0.1

| | |
|---|---|
| 语义 | 装饰原语：45° 等距平行胶囊棒束（母题 E01），按 d = x − y 定位 |
| 何时用 | 通常由 Cover / BackCover / SectionDivider 内部调用；确需自定义布点时才直接用 |
| 何时不用 | 内页正文区当装饰（破坏 R2 内页不出深色块） |
| 配套 | Cover, BackCover, SectionDivider |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 CapsuleDecor（族 G 页面骨架与图标）实现该区块。

语义：装饰原语：45° 等距平行胶囊棒束（母题 E01），按 d = x − y 定位
何时用：通常由 Cover / BackCover / SectionDivider 内部调用；确需自定义布点时才直接用
何时不用：内页正文区当装饰（破坏 R2 内页不出深色块）
配套：Cover, BackCover, SectionDivider
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<CapsuleDecor preset="divider" />
```

**配置代码**

```jsx
import { CapsuleDecor } from './src/lib'

<CapsuleDecor preset="divider" />
```

<details><summary>组件源码（primitives.jsx · 40 行）</summary>

```jsx
export function CapsuleDecor({ theme: t, preset = 'cover', style }) {
  const ctx = useTheme()
  const th = t || ctx
  const palettes = [th.capsuleDeep, th.functional, th.capsuleLight, '#FFFFFF']
  const presets = {
    // 封面：6 根 45° 等距平行斜带，用 d=x-y 定位、每根都算出画面内可见区间（含出血余量），
    // 从左边缘整齐铺开 → 有序、饱满，右上留白给 LOGO/标题。
    cover: (() => {
      const W = 794, H = 1123, N = 6, gap = 130, thick = 58, bleed = 70
      const pal = [th.capsuleDeep, th.functional, th.capsuleLight, '#FFFFFF']
      return Array.from({ length: N }, (_, i) => {
        const d = -700 + i * gap
        const sx = Math.max(0, d), sy = Math.max(0, -d)
        const ex = Math.min(W, d + H), ey = Math.min(H, W - d)
        return { x: sx - bleed, y: sy - bleed, len: (ex - sx) + bleed * 2, thick, c: pal[i % pal.length] }
      })
    })(),
    backcover: [
      { x: -80, y: -40, len: 560, thick: 84, c: th.capsuleDeep },
      { x: 90, y: 320, len: 460, thick: 76, c: th.functional },
      { x: 300, y: 480, len: 520, thick: 88, c: th.capsuleLight },
      { x: 480, y: 760, len: 420, thick: 80, c: '#FFFFFF' },
      { x: 620, y: 980, len: 300, thick: 72, c: th.capsuleDeep },
    ],
    corner: [
      { x: -80, y: 40, len: 220, thick: 46, c: palettes[2] },
      { x: -110, y: 90, len: 180, thick: 40, c: palettes[1] },
    ],
  }
  const sticks = presets[preset] || presets.cover
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
      viewBox="0 0 794 1123" preserveAspectRatio="xMidYMid slice">
      {sticks.map((s, i) => (
        <line key={i} x1={s.x} y1={s.y} x2={s.x + s.len} y2={s.y + s.len}
          stroke={s.c} strokeWidth={s.thick} strokeLinecap="round" />
      ))}
    </svg>
  )
}
```

</details>

### `Folio` · v0.1

| | |
|---|---|
| 语义 | 页码（– 0X –，奇偶左右交替） |
| 何时用 | 通常由 Page 自动渲染，无需手写 |
| 何时不用 | 手写页码（会与 Page 内置的重复） |
| 配套 | Page |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Folio（族 G 页面骨架与图标）实现该区块。

语义：页码（– 0X –，奇偶左右交替）
何时用：通常由 Page 自动渲染，无需手写
何时不用：手写页码（会与 Page 内置的重复）
配套：Page
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Folio num={4} side="right" />
```

**配置代码**

```jsx
import { Folio } from './src/lib'

<Folio num={4} side="right" />
```

<details><summary>组件源码（primitives.jsx · 11 行）</summary>

```jsx
export function Folio({ num, side = 'right', color, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      position: 'absolute', bottom: '10mm', [side]: '15mm',
      fontSize: '7pt', color: color || t.functional, letterSpacing: '0.5px', ...style,
    }}>
      – {String(num).padStart(2, '0')} –
    </div>
  )
}
```

</details>

### `Page` · v0.1

| | |
|---|---|
| 语义 | A4 页面根容器（210×297mm），自动渲染页码 |
| 何时用 | 每一个内页的最外层 |
| 何时不用 | 封面 / 封底（Cover / BackCover 自带页面，不要再套 Page） |
| 配套 | BrandHeaderBar, ContactFooterBand, Folio（内置） |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Page（族 G 页面骨架与图标）实现该区块。

语义：A4 页面根容器（210×297mm），自动渲染页码
何时用：每一个内页的最外层
何时不用：封面 / 封底（Cover / BackCover 自带页面，不要再套 Page）
配套：BrandHeaderBar, ContactFooterBand, Folio（内置）
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Page number={4} folioSide="right">{页面内容}</Page>
```

**配置代码**

```jsx
import { Page } from './src/lib'

<Page number={4} folioSide="right">{页面内容}</Page>
```

<details><summary>组件源码（primitives.jsx · 11 行）</summary>

```jsx
export function Page({ children, theme, number, folioSide = 'right', style }) {
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', background: '#fff', position: 'relative',
      overflow: 'hidden', padding: '18mm 15mm 20mm', boxSizing: 'border-box', ...style,
    }}>
      {children}
      {number != null && <Folio num={number} side={folioSide} />}
    </div>
  )
}
```

</details>

---

## 族 H · 流程与图解族（4 个）

### `ComboEquationDiagram` · v0.3

| | |
|---|---|
| 语义 | 组合公式图「A ＋ B » 产物」三栏式（每栏 = 胶囊标题 + 药丸清单） |
| 何时用 | 由若干要素组合成产物（A＋B»C） |
| 何时不用 | 并列条件（A 且 B 且 C，无产物）→ HexChain |
| 配套 | CycleFlowDiagram |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 ComboEquationDiagram（族 H 流程与图解族）实现该区块。

语义：组合公式图「A ＋ B » 产物」三栏式（每栏 = 胶囊标题 + 药丸清单）
何时用：由若干要素组合成产物（A＋B»C）
何时不用：并列条件（A 且 B 且 C，无产物）→ HexChain
配套：CycleFlowDiagram
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ComboEquationDiagram left={{ title: '脂质组分', items: ['可电离脂质'] }} right={{ title: 'mRNA', items: ['IVT 产物'] }} result={{ title: 'mRNA-LNP', items: ['成品'] }} />
```

**配置代码**

```jsx
import { ComboEquationDiagram } from './src/lib'

<ComboEquationDiagram left={{ title: '脂质组分', items: ['可电离脂质'] }} right={{ title: 'mRNA', items: ['IVT 产物'] }} result={{ title: 'mRNA-LNP', items: ['成品'] }} />
```

<details><summary>组件源码（process.jsx · 41 行）</summary>

```jsx
export function ComboEquationDiagram({ left, right, result, caption, style }) {
  const t = useTheme(); const n = useNeutral()

  const Column = ({ col, tone }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        background: tone || t.header, color: '#FFFFFF', fontSize: '7.5pt', fontWeight: 700,
        lineHeight: 1.2, padding: '1.6mm 2mm', borderRadius: '999px', textAlign: 'center',
      }}>{col.title}</div>
      <div style={{ marginTop: '2mm', display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {(col.items || []).map((it, i) => (
          <div key={i} style={{
            background: t.tint, color: n.text, fontSize: '6.8pt', lineHeight: 1.2,
            padding: '1.1mm 2.5mm', borderRadius: '999px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{it}</div>
        ))}
      </div>
    </div>
  )

  const Op = ({ sym }) => (
    <div style={{
      flex: '0 0 8mm', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13pt', fontWeight: 700, color: t.capsuleLight,
    }}>{sym}</div>
  )

  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Column col={left} tone={t.header} />
        <Op sym="＋" />
        <Column col={right} tone={t.capsuleLight} />
        <Op sym="»" />
        <Column col={result} tone={t.functional} />
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `CycleFlowDiagram` · v0.3

| | |
|---|---|
| 语义 | 环形迭代图：≤4 节点、渐变粗环、四角图标（仪表盘式，结构化） |
| 何时用 | 闭环迭代、回到起点 |
| 何时不用 | 3–8 节点的叙述式闭环 → AnnotatedCycle（本组件最多 4 个节点） |
| 配套 | ComboEquationDiagram |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 CycleFlowDiagram（族 H 流程与图解族）实现该区块。

语义：环形迭代图：≤4 节点、渐变粗环、四角图标（仪表盘式，结构化）
何时用：闭环迭代、回到起点
何时不用：3–8 节点的叙述式闭环 → AnnotatedCycle（本组件最多 4 个节点）
配套：ComboEquationDiagram
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<CycleFlowDiagram nodes={[{ label: '设计', icon: 'gear' }]} center={{ label: '迭代优化' }} />
```

**配置代码**

```jsx
import { CycleFlowDiagram } from './src/lib'

<CycleFlowDiagram nodes={[{ label: '设计', icon: 'gear' }]} center={{ label: '迭代优化' }} />
```

<details><summary>组件源码（process.jsx · 60 行）</summary>

```jsx
export function CycleFlowDiagram({ nodes = [], center, caption, size = 52, strokeWidth = 1.9, style }) {
  const t = useTheme()
  const gid = 'bdsCycle' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const pos = [{ col: 1, row: 1 }, { col: 3, row: 1 }, { col: 3, row: 3 }, { col: 1, row: 3 }]

  const Cell = ({ nd, idx }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '2mm',
      flexDirection: idx === 1 || idx === 2 ? 'row-reverse' : 'row',
    }}>
      <span style={{
        width: '8mm', height: '8mm', borderRadius: '50%', flex: '0 0 8mm',
        background: t.tint, border: `0.6pt solid ${t.capsuleLight}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={nd.icon || 'gear'} size={13} primary={t.header} secondary={t.capsuleLight} />
      </span>
      <span style={{ fontSize: '7.5pt', fontWeight: 600, color: t.header, whiteSpace: 'nowrap' }}>{nd.label}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5mm 0', ...style }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gridTemplateRows: 'auto auto auto',
        alignItems: 'center', justifyItems: 'center', columnGap: '3mm', rowGap: '1mm',
      }}>
        {nodes[0] && <div style={{ gridColumn: 1, gridRow: 1 }}><Cell nd={nodes[0]} idx={0} /></div>}
        {nodes[1] && <div style={{ gridColumn: 3, gridRow: 1 }}><Cell nd={nodes[1]} idx={1} /></div>}

        <div style={{
          gridColumn: 2, gridRow: 1, gridRowEnd: 4, position: 'relative',
          width: `${size}mm`, height: `${size}mm`,
        }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={t.ramp[0]} />
                <stop offset="38%" stopColor={t.ramp[1]} />
                <stop offset="72%" stopColor={t.ramp[2]} />
                <stop offset="100%" stopColor={t.ramp[3]} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="36" fill="none" stroke={`url(#${gid})`} strokeWidth={strokeWidth}
              strokeLinecap="round" strokeDasharray="200 26" transform="rotate(-102 50 50)" />
          </svg>
          <div style={{
            position: 'absolute', inset: '28%', borderRadius: '50%', background: t.tint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '7.5pt', fontWeight: 700, color: t.header, textAlign: 'center', lineHeight: 1.3,
          }}>{center}</div>
        </div>

        {nodes[3] && <div style={{ gridColumn: 1, gridRow: 3 }}><Cell nd={nodes[3]} idx={3} /></div>}
        {nodes[2] && <div style={{ gridColumn: 3, gridRow: 3 }}><Cell nd={nodes[2]} idx={2} /></div>}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `FunnelStages` · v0.3

| | |
|---|---|
| 语义 | 量化收敛漏斗：逐层收窄横条 + 左侧虚线引线方法名 + 右侧量化数字 |
| 何时用 | 筛选 / 收敛过程并带量化 |
| 何时不用 | 等量并列的多步 → NumberedStepFlow |
| 配套 | DataChart, TargetBarChart |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 FunnelStages（族 H 流程与图解族）实现该区块。

语义：量化收敛漏斗：逐层收窄横条 + 左侧虚线引线方法名 + 右侧量化数字
何时用：筛选 / 收敛过程并带量化
何时不用：等量并列的多步 → NumberedStepFlow
配套：DataChart, TargetBarChart
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<FunnelStages stages={[{ method: 'DEL', label: '初筛', value: '10⁹' }]} />
```

**配置代码**

```jsx
import { FunnelStages } from './src/lib'

<FunnelStages stages={[{ method: 'DEL', label: '初筛', value: '10⁹' }]} />
```

<details><summary>组件源码（process.jsx · 39 行）</summary>

```jsx
export function FunnelStages({ stages = [], caption, minWidth = 42, style }) {
  const t = useTheme(); const n = useNeutral()
  const total = stages.length
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {stages.map((s, i) => {
        const w = total > 1 ? 100 - (i * (100 - minWidth)) / (total - 1) : 100
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.8mm' }}>
            <div style={{
              width: '40mm', flex: '0 0 40mm', paddingRight: '2.5mm',
              textAlign: 'right', fontSize: '7pt', color: n.textSoft, lineHeight: 1.3,
            }}>
              {s.method}
              <div style={{ borderTop: `0.5pt dashed ${n.line}`, marginTop: '1mm' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <div style={{
                width: `${w}%`, height: '10mm', boxSizing: 'border-box',
                background: s.highlight ? t.capsuleLight : t.functional,
                borderRadius: '1mm', display: 'flex', alignItems: 'center',
                paddingLeft: '4mm', paddingRight: '2mm',
                color: '#FFFFFF', fontSize: '8.5pt', fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{s.label}</div>
              {s.value && (
                <div style={{
                  marginLeft: '3mm', fontSize: '9.5pt', fontWeight: 700,
                  color: t.functional, whiteSpace: 'nowrap',
                }}>{s.value}</div>
              )}
            </div>
          </div>
        )
      })}
      {caption && <FigCaption align="right">{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `StagePipelineChain` · v0.3

| | |
|---|---|
| 语义 | 阶段管线链：横向圆形节点 + › 箭头，可选底部 spectrum 服务边界条（总图首选） |
| 何时用 | 全册总流程页；「总-分锚定」的锚 |
| 何时不用 | 多入口汇聚的网络 → ServiceNetworkMap；实验动作 → BeadChain |
| 配套 | PhaseBand, FlowChain |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 StagePipelineChain（族 H 流程与图解族）实现该区块。

语义：阶段管线链：横向圆形节点 + › 箭头，可选底部 spectrum 服务边界条（总图首选）
何时用：全册总流程页；「总-分锚定」的锚
何时不用：多入口汇聚的网络 → ServiceNetworkMap；实验动作 → BeadChain
配套：PhaseBand, FlowChain
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<StagePipelineChain stages={['设计', '合成', '包封', '放行']} spectrum={['CRO', 'CDMO']} />
```

**配置代码**

```jsx
import { StagePipelineChain } from './src/lib'

<StagePipelineChain stages={['设计', '合成', '包封', '放行']} spectrum={['CRO', 'CDMO']} />
```

<details><summary>组件源码（process.jsx · 55 行）</summary>

```jsx
export function StagePipelineChain({ stages = [], spectrum, caption, nodeSize = 18, style }) {
  const t = useTheme()
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {stages.map((s, i) => {
          const label = typeof s === 'string' ? s : s.label
          const active = typeof s === 'object' && !!s.active
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: `${nodeSize}mm`, height: `${nodeSize}mm`, borderRadius: '50%',
                boxSizing: 'border-box', flex: `0 0 ${nodeSize}mm`,
                background: active ? t.functional : t.tint,
                border: `0.6pt solid ${active ? t.functional : t.capsuleLight}`,
                color: active ? '#FFFFFF' : t.header,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontSize: '5.8pt', lineHeight: 1.3, fontWeight: 600, padding: '1.2mm',
              }}>{label}</div>
              {i < stages.length - 1 && (
                <span style={{
                  color: t.capsuleLight, fontSize: '11pt', fontWeight: 700,
                  margin: '0 0.8mm', lineHeight: 1,
                }}>›</span>
              )}
            </div>
          )
        })}
      </div>

      {spectrum && (
        <div style={{ position: 'relative', marginTop: '3.5mm' }}>
          <div style={{
            height: '10mm', borderRadius: '1mm', boxSizing: 'border-box',
            border: `0.5pt solid ${t.capsuleLight}`,
            background: `repeating-linear-gradient(115deg, ${t.tint} 0 3.2mm, ${t.zebra} 3.2mm 6.4mm)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '5mm',
          }}>
            {spectrum.map((s, i) => (
              <span key={i} style={{
                background: i === spectrum.length - 1 ? t.capsuleLight : t.functional,
                color: '#FFFFFF', fontSize: '8pt', fontWeight: 700, lineHeight: 1,
                padding: '1.6mm 5mm', borderRadius: '999px',
              }}>{typeof s === 'string' ? s : s.label}</span>
            ))}
          </div>
        </div>
      )}
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

---

## 族 I · 数据与证据族（6 个）

### `AnnotatedDonut` · v0.4

| | |
|---|---|
| 语义 | 注释甜甜圈：中心双行标签 + N 段环 + 环外侧同色标题注解块（注解块标题色 == 扇区色） |
| 何时用 | 构成占比 + 逐块解释（「我们有什么」的总览页） |
| 何时不用 | 排序比较 → TargetBarChart；palette 默认 category 是 R22 的显式例外 |
| 配套 | FigCaption, AnnotationPair |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p3「药物发现」 |

**提示词**（直接复制）

```text
用本设计系统的 AnnotatedDonut（族 I 数据与证据族）实现该区块。

语义：注释甜甜圈：中心双行标签 + N 段环 + 环外侧同色标题注解块（注解块标题色 == 扇区色）
何时用：构成占比 + 逐块解释（「我们有什么」的总览页）
何时不用：排序比较 → TargetBarChart；palette 默认 category 是 R22 的显式例外
配套：FigCaption, AnnotationPair
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<AnnotatedDonut segments={[{ label: '质粒服务', points: ['酶切图谱', '全长测序'] }]} />
```

**配置代码**

```jsx
import { AnnotatedDonut } from './src/lib'

<AnnotatedDonut segments={[{ label: '质粒服务', points: ['酶切图谱', '全长测序'] }]} />
```

<details><summary>组件源码（data.jsx · 3 行）</summary>

```jsx
export function AnnotatedDonut({
  segments = [], center, size = 62, thickness = 20, palette = 'category', caption, style,
}
```

</details>

### `CitationBlock` · v0.3

| | |
|---|---|
| 语义 | 文献引用块：期刊名加粗深灰 + 卷期页次级灰，CSS 多栏流式 |
| 何时用 | 信任页的同行评议引用（R19：信任靠引用，不做 logo 墙） |
| 何时不用 | 客户评价 → TestimonialCard |
| 配套 | TestimonialCard |
| **来源配色** | **MCE 化合物库手册 橙 #F09B40（编号 / 文献专用）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE 五册逆向 · R19 |

**提示词**（直接复制）

```text
用本设计系统的 CitationBlock（族 I 数据与证据族）实现该区块。

语义：文献引用块：期刊名加粗深灰 + 卷期页次级灰，CSS 多栏流式
何时用：信任页的同行评议引用（R19：信任靠引用，不做 logo 墙）
何时不用：客户评价 → TestimonialCard
配套：TestimonialCard
来源配色：MCE 化合物库手册 橙 #F09B40（编号 / 文献专用）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<CitationBlock items={[{ journal: 'Nat Rev Drug Discov', text: '2023;22:1–18' }]} />
```

**配置代码**

```jsx
import { CitationBlock } from './src/lib'

<CitationBlock items={[{ journal: 'Nat Rev Drug Discov', text: '2023;22:1–18' }]} />
```

<details><summary>组件源码（data.jsx · 27 行）</summary>

```jsx
export function CitationBlock({ title, items = [], columns = 2, icon = true, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '2mm',
          fontSize: '9pt', fontWeight: 700, color: t.functional, marginBottom: '2.5mm',
        }}>
          {icon && <Icon name="award" size={14} primary={t.functional} secondary={t.capsuleLight} />}
          <span>{title}</span>
        </div>
      )}
      <div style={{ columnCount: columns, columnGap: '7mm' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            breakInside: 'avoid', marginBottom: '2mm',
            fontSize: '7pt', lineHeight: 1.5, textAlign: 'left',
          }}>
            <span style={{ fontWeight: 700, color: n.text }}>{it.journal}</span>
            {it.text && <span style={{ color: n.textSoft }}>{' '}{it.text}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
```

</details>

### `InstrumentReportPanel` · v0.3

| | |
|---|---|
| 语义 | 仪器报告面板：浅色标题条 + 图与数据表同框，表内无竖线（技术语体） |
| 何时用 | QC 检测数据、方法学、仪器报告页 |
| 何时不用 | 营销参数表 → SpecTable（R16：两种语体按页型选用，不可混页） |
| 配套 | MethodTable |
| **来源配色** | **MCE 五册 · 技术语体（浅底细线，不做实底反白）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 InstrumentReportPanel（族 I 数据与证据族）实现该区块。

语义：仪器报告面板：浅色标题条 + 图与数据表同框，表内无竖线（技术语体）
何时用：QC 检测数据、方法学、仪器报告页
何时不用：营销参数表 → SpecTable（R16：两种语体按页型选用，不可混页）
配套：MethodTable
来源配色：MCE 五册 · 技术语体（浅底细线，不做实底反白）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<InstrumentReportPanel blocks={[{ label: '粒径与 PDI', columns: ['批次', 'Z-avg'], rows: [['L1', '92 nm']] }]} />
```

**配置代码**

```jsx
import { InstrumentReportPanel } from './src/lib'

<InstrumentReportPanel blocks={[{ label: '粒径与 PDI', columns: ['批次', 'Z-avg'], rows: [['L1', '92 nm']] }]} />
```

<details><summary>组件源码（data.jsx · 22 行）</summary>

```jsx
export function InstrumentReportPanel({ blocks = [], style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      border: `0.5pt solid ${t.capsuleLight}`, borderRadius: '0.8mm',
      overflow: 'hidden', margin: '5mm 0', ...style,
    }}>
      {blocks.map((b, bi) => (
        <div key={bi}>
          <div style={{
            background: t.tint, color: n.text, fontSize: '7.5pt', fontWeight: 600,
            padding: '1.4mm 3mm', borderTop: bi ? `0.5pt solid ${t.capsuleLight}` : 'none',
          }}>{b.label}</div>
          <div style={{ padding: b.pad === false ? 0 : '3mm', background: '#FFFFFF' }}>
            {b.chart}
            {b.columns && <ReportTable columns={b.columns} rows={b.rows} total={b.total} />}
          </div>
        </div>
      ))}
    </div>
  )
}
```

</details>

### `PanelBarChart` · v0.4

| | |
|---|---|
| 语义 | 小倍数面板条形图：竖基线 + 顶部刻度 + 左类标的多面板（同构多图） |
| 何时用 | 理化参数分布页；需要多个同构图并排 |
| 何时不用 | 单图排行 → TargetBarChart；注意多面板必须开 sharedScale |
| 配套 | FigCaption, NoteBand |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p45「片段化合物库相关参数」 |

**提示词**（直接复制）

```text
用本设计系统的 PanelBarChart（族 I 数据与证据族）实现该区块。

语义：小倍数面板条形图：竖基线 + 顶部刻度 + 左类标的多面板（同构多图）
何时用：理化参数分布页；需要多个同构图并排
何时不用：单图排行 → TargetBarChart；注意多面板必须开 sharedScale
配套：FigCaption, NoteBand
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<PanelBarChart panels={[{ title: '分子量', items: [{ label: 'A', value: 12 }] }]} sharedScale />
```

**配置代码**

```jsx
import { PanelBarChart } from './src/lib'

<PanelBarChart panels={[{ title: '分子量', items: [{ label: 'A', value: 12 }] }]} sharedScale />
```

<details><summary>组件源码（data.jsx · 4 行）</summary>

```jsx
export function PanelBarChart({
  panels = [], columns = 2, ticks = 4, barColor, labelWidth = '15mm',
  sharedScale = false, barHeight = '4.4mm', caption, style,
}
```

</details>

### `ScatterClusterPanel` · v0.4

| | |
|---|---|
| 语义 | 散点聚类面板：散点云 + 半透明聚类色块 + 色块图例（分布形态本身就是信息） |
| 何时用 | 化学空间、分布形态、聚类与离散 |
| 何时不用 | 精确数值比较 → TargetBarChart / DataChart；points 省略时按 seed 确定性生成 |
| 配套 | SwatchLegend, FigCaption |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p44 上带 |

**提示词**（直接复制）

```text
用本设计系统的 ScatterClusterPanel（族 I 数据与证据族）实现该区块。

语义：散点聚类面板：散点云 + 半透明聚类色块 + 色块图例（分布形态本身就是信息）
何时用：化学空间、分布形态、聚类与离散
何时不用：精确数值比较 → TargetBarChart / DataChart；points 省略时按 seed 确定性生成
配套：SwatchLegend, FigCaption
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ScatterClusterPanel clusters={[{ x: 40, y: 55, r: 18 }]} legend={[{ label: 'A 类', color: '#7EC0EE' }]} seed={7} />
```

**配置代码**

```jsx
import { ScatterClusterPanel } from './src/lib'

<ScatterClusterPanel clusters={[{ x: 40, y: 55, r: 18 }]} legend={[{ label: 'A 类', color: '#7EC0EE' }]} seed={7} />
```

<details><summary>组件源码（data.jsx · 4 行）</summary>

```jsx
export function ScatterClusterPanel({
  points, clusters = [], legend = [], height = 46, dot = 1.5,
  palette = 'category', seed = 7, caption, style,
}
```

</details>

### `TargetBarChart` · v0.3

| | |
|---|---|
| 语义 | 排序条形图：轴在顶部 + 右侧类标列 + 单色横条（替代饼图） |
| 何时用 | 单序列排行：靶点举例、参数分布、品类计数 |
| 何时不用 | 多面板小倍数 → PanelBarChart；构成占比 → AnnotatedDonut |
| 配套 | FigCaption |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 TargetBarChart（族 I 数据与证据族）实现该区块。

语义：排序条形图：轴在顶部 + 右侧类标列 + 单色横条（替代饼图）
何时用：单序列排行：靶点举例、参数分布、品类计数
何时不用：多面板小倍数 → PanelBarChart；构成占比 → AnnotatedDonut
配套：FigCaption
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<TargetBarChart items={[{ label: 'KRAS', value: 42 }]} caption="图 2  靶点分布" />
```

**配置代码**

```jsx
import { TargetBarChart } from './src/lib'

<TargetBarChart items={[{ label: 'KRAS', value: 42 }]} caption="图 2  靶点分布" />
```

<details><summary>组件源码（data.jsx · 43 行）</summary>

```jsx
export function TargetBarChart({ items = [], ticks = 5, caption, barColor, labelWidth = '46mm', style }) {
  const t = useTheme(); const n = useNeutral()
  if (!items.length) return null
  const max = niceMax(Math.max(...items.map(i => i.value)), ticks)
  const scale = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max / ticks) * i))

  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {/* 轴（在顶部，与 MCE 一致） */}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ flex: `0 0 ${labelWidth}` }} />
        <div style={{ flex: 1, position: 'relative', height: '5mm', borderBottom: `0.5pt solid ${n.line}` }}>
          {scale.map((v, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${(v / max) * 100}%`, bottom: '0.9mm',
              transform: 'translateX(-50%)', fontSize: '6.5pt', color: n.textSoft, whiteSpace: 'nowrap',
            }}>{v}</div>
          ))}
        </div>
      </div>
      {/* 条 */}
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', height: '6.2mm' }}>
          <div style={{
            flex: `0 0 ${labelWidth}`, textAlign: 'right', paddingRight: '3mm',
            fontSize: '7pt', color: n.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{it.label}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              width: `${Math.max((it.value / max) * 100, 0.6)}%`, height: '4mm',
              background: it.color || barColor || t.functional,
            }} />
          </div>
        </div>
      ))}
      {caption && (
        <div style={{
          textAlign: 'right', fontSize: '8pt', fontWeight: 700, color: n.text, marginTop: '2.5mm',
        }}>{caption}</div>
      )}
    </div>
  )
}
```

</details>

---

## 族 J · 标签族（3 个）

### `CategoryTagRow` · v0.3

| | |
|---|---|
| 语义 | 类目胶囊标签行：水平自动换行的圆角胶囊（浅底 + 同色相深一阶字） |
| 何时用 | 类目 / 标签横排；子能力概览 |
| 何时不用 | 子能力的长清单 → ChipPillGrid；图例色标 → SwatchLegend |
| 配套 | ProductCardGrid, ServiceNetworkMap |
| **来源配色** | **MCE 质量管理体系 青 tint #C1E7ED（源色 青 #41B3B9）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-qms` · QMS 珊瑚红（主色 `#F16366`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE 五册逆向 · R21 |

**提示词**（直接复制）

```text
用本设计系统的 CategoryTagRow（族 J 标签族）实现该区块。

语义：类目胶囊标签行：水平自动换行的圆角胶囊（浅底 + 同色相深一阶字）
何时用：类目 / 标签横排；子能力概览
何时不用：子能力的长清单 → ChipPillGrid；图例色标 → SwatchLegend
配套：ProductCardGrid, ServiceNetworkMap
来源配色：MCE 质量管理体系 青 tint #C1E7ED（源色 青 #41B3B9）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-qms（QMS 珊瑚红 · 主色 #F16366）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<CategoryTagRow items={[{ label: '质粒服务', color: '#C1E7ED' }]} />
```

**配置代码**

```jsx
import { CategoryTagRow } from './src/lib'

<CategoryTagRow items={[{ label: '质粒服务', color: '#C1E7ED' }]} />
```

<details><summary>组件源码（tags.jsx · 23 行）</summary>

```jsx
export function CategoryTagRow({ items = [], size = 'md', style }) {
  const t = useTheme()
  const ramps = pastelRamp(t.functional, Math.max(items.length, 1))
  const pad = size === 'sm' ? '1mm 3mm' : '1.5mm 4.4mm'
  const fs = size === 'sm' ? '6.5pt' : '7.5pt'

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.6mm', margin: '3mm 0', ...style }}>
      {items.map((it, i) => {
        const label = typeof it === 'string' ? it : it.label
        const r = ramps[i % ramps.length]
        return (
          <span key={i} style={{
            background: (typeof it === 'object' && it.color) || r.bg,
            color: (typeof it === 'object' && it.fg) || r.fg,
            fontSize: fs, fontWeight: 600, lineHeight: 1.2,
            padding: pad, borderRadius: '999px', whiteSpace: 'nowrap',
          }}>{label}</span>
        )
      })}
    </div>
  )
}
```

</details>

### `ChipPillGrid` · v0.3

| | |
|---|---|
| 语义 | 芯片标签网格：浅底圆角芯片 + 行内小图标（2–3 列） |
| 何时用 | 子能力清单 |
| 何时不用 | 需要图标 + 详细说明的特性 → IconFeatureList |
| 配套 | IconFeatureList |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.3 批 |

**提示词**（直接复制）

```text
用本设计系统的 ChipPillGrid（族 J 标签族）实现该区块。

语义：芯片标签网格：浅底圆角芯片 + 行内小图标（2–3 列）
何时用：子能力清单
何时不用：需要图标 + 详细说明的特性 → IconFeatureList
配套：IconFeatureList
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ChipPillGrid items={[{ label: '无菌灌装', icon: 'shield' }]} />
```

**配置代码**

```jsx
import { ChipPillGrid } from './src/lib'

<ChipPillGrid items={[{ label: '无菌灌装', icon: 'shield' }]} />
```

<details><summary>组件源码（tags.jsx · 24 行）</summary>

```jsx
export function ChipPillGrid({ items = [], columns = 3, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '2mm', margin: '4mm 0', ...style,
    }}>
      {items.map((it, i) => {
        const label = typeof it === 'string' ? it : it.label
        const icon = typeof it === 'object' ? it.icon : null
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '2mm',
            background: t.tint, borderRadius: '1mm', padding: '2mm 2.5mm',
            fontSize: '7.5pt', color: t.header, minWidth: 0,
          }}>
            {icon && <Icon name={icon} size={13} primary={t.header} secondary={t.capsuleLight} />}
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
```

</details>

### `IconFeatureList` · v0.3

| | |
|---|---|
| 语义 | 图标特性列表：实心彩圆图标 + 彩色标题 + 圆点列表（R17 图标必入容器） |
| 何时用 | 能力 / 特性的详细说明 |
| 何时不用 | 短标签 → ChipPillGrid；卖点卡 → StatCardRow |
| 配套 | ChipPillGrid |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · R17 |

**提示词**（直接复制）

```text
用本设计系统的 IconFeatureList（族 J 标签族）实现该区块。

语义：图标特性列表：实心彩圆图标 + 彩色标题 + 圆点列表（R17 图标必入容器）
何时用：能力 / 特性的详细说明
何时不用：短标签 → ChipPillGrid；卖点卡 → StatCardRow
配套：ChipPillGrid
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<IconFeatureList items={[{ icon: 'flask', title: '工艺开发', points: ['DOE 优化'] }]} />
```

**配置代码**

```jsx
import { IconFeatureList } from './src/lib'

<IconFeatureList items={[{ icon: 'flask', title: '工艺开发', points: ['DOE 优化'] }]} />
```

<details><summary>组件源码（tags.jsx · 39 行）</summary>

```jsx
export function IconFeatureList({ items = [], columns = 3, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramps = pastelRamp(t.functional, Math.max(items.length, 1))

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '5mm', margin: '4mm 0', ...style,
    }}>
      {items.map((it, i) => {
        const circle = it.color || ramps[i % ramps.length].base
        return (
          <div key={i} style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5mm', marginBottom: '2mm' }}>
              <span style={{
                width: '8mm', height: '8mm', borderRadius: '50%', flex: '0 0 8mm',
                background: circle, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={it.icon || 'check'} size={14} primary="#FFFFFF" secondary="#FFFFFF" />
              </span>
              <span style={{ fontSize: '9pt', fontWeight: 700, color: it.titleColor || t.header }}>{it.title}</span>
            </div>
            {it.points?.length > 0 && (
              <ul style={{
                margin: 0, paddingLeft: '4.5mm', color: n.text,
                fontSize: '7.5pt', lineHeight: 1.65, listStyle: 'disc',
              }}>
                {it.points.map((p, j) => <li key={j} style={{ marginBottom: '0.6mm' }}>{p}</li>)}
              </ul>
            )}
            {it.text && (
              <div style={{ color: n.text, fontSize: '7.5pt', lineHeight: 1.65 }}>{it.text}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

</details>

---

## 族 K · 文本族（7 个）

### `AnnotationPair` · v0.4

| | |
|---|---|
| 语义 | 注解对：上中文 9pt 深灰 + 下英文 7.5pt 浅灰（可加左竖线） |
| 何时用 | 图旁的注解、服务网络图两侧的说明、双语页的每一条要点 |
| 何时不用 | 通栏连续段落 → BodyText；需要左右分栏对照 → 用两列网格包 BodyText |
| 配套 | ServiceNetworkMap, LegendFigure |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 AnnotationPair（族 K 文本族）实现该区块。

语义：注解对：上中文 9pt 深灰 + 下英文 7.5pt 浅灰（可加左竖线）
何时用：图旁的注解、服务网络图两侧的说明、双语页的每一条要点
何时不用：通栏连续段落 → BodyText；需要左右分栏对照 → 用两列网格包 BodyText
配套：ServiceNetworkMap, LegendFigure
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<AnnotationPair cn="现象：粒径随 N/P 比下降" en="Particle size decreases with N/P ratio" />
```

**配置代码**

```jsx
import { AnnotationPair } from './src/lib'

<AnnotationPair cn="现象：粒径随 N/P 比下降" en="Particle size decreases with N/P ratio" />
```

<details><summary>组件源码（text.jsx · 20 行）</summary>

```jsx
export function AnnotationPair({ cn, en, divider = true, size = 'md', align = 'left', style }) {
  const t = useTheme(); const n = useNeutral()
  const cnSize = size === 'sm' ? '8pt' : '9pt'
  const enSize = size === 'sm' ? '6.5pt' : '7.5pt'
  return (
    <div style={{ display: 'flex', gap: '2.4mm', textAlign: align, ...style }}>
      {divider && (
        <div style={{ flex: '0 0 0.9mm', background: t.capsuleLight, borderRadius: '0.5mm' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: cnSize, color: n.text, fontWeight: 600, lineHeight: 1.55 }}>{cn}</div>
        {en && (
          <div style={{
            fontSize: enSize, color: n.textSoft, fontWeight: 300, lineHeight: 1.45, marginTop: '0.7mm',
          }}>{en}</div>
        )}
      </div>
    </div>
  )
}
```

</details>

### `BodyText` · v0.4

| | |
|---|---|
| 语义 | 正文段落（支持 **行内加粗**，可 1–2 栏流式） |
| 何时用 | 连续论述的正文 |
| 何时不用 | 分点罗列 → BulletList / NumberedList；多栏仅用于无小标题的连续论述 |
| 配套 | FigCaption, BarTitle |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 BodyText（族 K 文本族）实现该区块。

语义：正文段落（支持 **行内加粗**，可 1–2 栏流式）
何时用：连续论述的正文
何时不用：分点罗列 → BulletList / NumberedList；多栏仅用于无小标题的连续论述
配套：FigCaption, BarTitle
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BodyText text="LNP 由四种脂质组分自组装而成，**可电离脂质**决定内体逃逸效率。" columns={2} />
```

**配置代码**

```jsx
import { BodyText } from './src/lib'

<BodyText text="LNP 由四种脂质组分自组装而成，**可电离脂质**决定内体逃逸效率。" columns={2} />
```

<details><summary>组件源码（text.jsx · 15 行）</summary>

```jsx
export function BodyText({ text, children, columns = 1, size = 'lg', justify = true, style }) {
  const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.lg
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.78,
      textAlign: justify ? 'justify' : 'left',
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {text != null ? renderRich(text) : children}
    </div>
  )
}
```

</details>

### `BulletList` · v0.4

| | |
|---|---|
| 语义 | 圆点列表（主题色圆点），语义 = 并列、无先后 |
| 何时用 | 并列要点罗列 |
| 何时不用 | 有先后顺序 → NumberedList；实验动作序列 → BeadChain |
| 配套 | BarTitle, DefinitionList |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 BulletList（族 K 文本族）实现该区块。

语义：圆点列表（主题色圆点），语义 = 并列、无先后
何时用：并列要点罗列
何时不用：有先后顺序 → NumberedList；实验动作序列 → BeadChain
配套：BarTitle, DefinitionList
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BulletList items={['**粒径** 80–120 nm', 'PDI ≤ 0.2']} columns={2} />
```

**配置代码**

```jsx
import { BulletList } from './src/lib'

<BulletList items={['**粒径** 80–120 nm', 'PDI ≤ 0.2']} columns={2} />
```

<details><summary>组件源码（text.jsx · 19 行）</summary>

```jsx
export function BulletList({ items = [], columns = 1, size = 'md', marker = '•', style }) {
  const t = useTheme(); const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.72,
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '1.8mm', breakInside: 'avoid', marginBottom: '1.1mm' }}>
          <span style={{ color: t.functional, flexShrink: 0, lineHeight: 1.72 }}>{marker}</span>
          <span style={{ flex: 1, minWidth: 0 }}>{renderRich(it)}</span>
        </div>
      ))}
    </div>
  )
}
```

</details>

### `DefinitionList` · v0.4

| | |
|---|---|
| 语义 | 术语定义列表：左术语（深灰粗）+ 右释义（正文灰），行间细线 |
| 何时用 | 技术名词解释、缩写对照、页面右下角名词栏 |
| 何时不用 | 属性→取值清单（要底色与可读性优先）→ KeyValueTable；不需要表格语义时用本组件 |
| 配套 | BarTitle |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 DefinitionList（族 K 文本族）实现该区块。

语义：术语定义列表：左术语（深灰粗）+ 右释义（正文灰），行间细线
何时用：技术名词解释、缩写对照、页面右下角名词栏
何时不用：属性→取值清单（要底色与可读性优先）→ KeyValueTable；不需要表格语义时用本组件
配套：BarTitle
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<DefinitionList items={[{ term: 'LNP', en: 'Lipid nanoparticle', desc: '脂质纳米颗粒' }]} />
```

**配置代码**

```jsx
import { DefinitionList } from './src/lib'

<DefinitionList items={[{ term: 'LNP', en: 'Lipid nanoparticle', desc: '脂质纳米颗粒' }]} />
```

<details><summary>组件源码（text.jsx · 21 行）</summary>

```jsx
export function DefinitionList({ items = [], termWidth = '30mm', size = 'md', rule = true, style }) {
  const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{ margin: '0 0 4mm', ...style }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', gap: '3mm', padding: '1.8mm 0', alignItems: 'flex-start',
          borderBottom: rule && i < items.length - 1 ? `0.4pt solid ${n.line}` : 'none',
        }}>
          <div style={{
            flex: `0 0 ${termWidth}`, fontWeight: 700, color: '#333', fontSize: fs, lineHeight: 1.6,
          }}>{it.term}</div>
          <div style={{ flex: 1, minWidth: 0, color: n.text, fontSize: fs, lineHeight: 1.68 }}>
            {renderRich(it.def)}
          </div>
        </div>
      ))}
    </div>
  )
}
```

</details>

### `FigCaption` · v0.4

| | |
|---|---|
| 语义 | 图注：图下方的小字说明（strong=加粗深灰结论 / soft=浅灰描述） |
| 何时用 | 任何图 / 表的下方 |
| 何时不用 | 图上方的标题 → FigurePanel 的 title；正文段落 → BodyText |
| 配套 | FigurePanel, FigurePanel 内容 |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向（原页图注在右下角加粗深灰） |

**提示词**（直接复制）

```text
用本设计系统的 FigCaption（族 K 文本族）实现该区块。

语义：图注：图下方的小字说明（strong=加粗深灰结论 / soft=浅灰描述）
何时用：任何图 / 表的下方
何时不用：图上方的标题 → FigurePanel 的 title；正文段落 → BodyText
配套：FigurePanel, FigurePanel 内容
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<FigCaption tone="strong">图 1  LNP 粒径与 PDI 分布</FigCaption>
```

**配置代码**

```jsx
import { FigCaption } from './src/lib'

<FigCaption tone="strong">图 1  LNP 粒径与 PDI 分布</FigCaption>
```

<details><summary>组件源码（text.jsx · 12 行）</summary>

```jsx
export function FigCaption({ children, tone = 'strong', align, style }) {
  const n = useNeutral()
  return (
    <div style={{
      fontSize: '7.5pt',
      fontWeight: tone === 'strong' ? 600 : 400,
      color: tone === 'strong' ? n.text : n.textSoft,
      textAlign: align || (tone === 'strong' ? 'right' : 'center'),
      lineHeight: 1.5, marginTop: '2mm', ...style,
    }}>{children}</div>
  )
}
```

</details>

### `NoteBand` · v0.4

| | |
|---|---|
| 语义 | 版心内的提示带：左色条 + 浅底 + 说明文字（solid 为主题色实底反白） |
| 何时用 | 「注意 / 用哪个 / 为什么这样做」这类编者提示；合规声明 |
| 何时不用 | 页脚最末的 * 小字 → Footnotes（NoteBand 在版心内，Footnotes 在页脚） |
| 配套 | Footnotes, ConclusionBanner |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 NoteBand（族 K 文本族）实现该区块。

语义：版心内的提示带：左色条 + 浅底 + 说明文字（solid 为主题色实底反白）
何时用：「注意 / 用哪个 / 为什么这样做」这类编者提示；合规声明
何时不用：页脚最末的 * 小字 → Footnotes（NoteBand 在版心内，Footnotes 在页脚）
配套：Footnotes, ConclusionBanner
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<NoteBand icon="gear" label="为什么" text="**PEG-脂质**过量会降低细胞摄取。" />
```

**配置代码**

```jsx
import { NoteBand } from './src/lib'

<NoteBand icon="gear" label="为什么" text="**PEG-脂质**过量会降低细胞摄取。" />
```

<details><summary>组件源码（text.jsx · 23 行）</summary>

```jsx
export function NoteBand({ children, text, label, icon, tone = 'tint', style }) {
  const t = useTheme(); const n = useNeutral()
  const solid = tone === 'solid'
  const line = tone === 'line'
  return (
    <div style={{
      display: 'flex', gap: '2.6mm', alignItems: 'flex-start', margin: '4mm 0',
      background: solid ? t.functional : line ? 'transparent' : t.tint,
      color: solid ? '#fff' : n.text,
      borderLeft: line ? `1.6mm solid ${t.functional}` : 'none',
      borderRadius: '1.2mm', padding: '3mm 3.8mm', ...style,
    }}>
      {icon && (
        <Icon name={icon} size={15} primary={solid ? '#FFFFFF' : t.functional}
          secondary={solid ? '#FFFFFF' : t.capsuleLight} style={{ marginTop: '0.4mm', flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0, fontSize: '8.5pt', lineHeight: 1.72 }}>
        {label && <div style={{ fontWeight: 700, marginBottom: '0.9mm' }}>{label}</div>}
        {text != null ? renderRich(text) : children}
      </div>
    </div>
  )
}
```

</details>

### `NumberedList` · v0.4

| | |
|---|---|
| 语义 | 数字列表（主题色等宽数字、右对齐成列），语义 = 并列、有先后 |
| 何时用 | 有先后顺序的条目（第 10 项不会把文字推歪） |
| 何时不用 | 纯并列 → BulletList；需要图形化的步骤流 → NumberedStepFlow |
| 配套 | BarTitle |
| **来源配色** | **中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）** |
| 来源脉 `src` | `neutral` · 中性文本层 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 NumberedList（族 K 文本族）实现该区块。

语义：数字列表（主题色等宽数字、右对齐成列），语义 = 并列、有先后
何时用：有先后顺序的条目（第 10 项不会把文字推歪）
何时不用：纯并列 → BulletList；需要图形化的步骤流 → NumberedStepFlow
配套：BarTitle
来源配色：中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
来源脉：中性文本层 —— 配色必须从该脉的主题取：（无专属色相，随调用页主题）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<NumberedList items={['质粒构建', '体外转录', 'LNP 包封']} />
```

**配置代码**

```jsx
import { NumberedList } from './src/lib'

<NumberedList items={['质粒构建', '体外转录', 'LNP 包封']} />
```

<details><summary>组件源码（text.jsx · 22 行）</summary>

```jsx
export function NumberedList({ items = [], columns = 1, start = 1, size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.72,
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '2mm', breakInside: 'avoid', marginBottom: '1.1mm' }}>
          <span style={{
            flex: '0 0 5mm', textAlign: 'right', color: t.functional, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', flexShrink: 0,
          }}>{i + start}.</span>
          <span style={{ flex: 1, minWidth: 0 }}>{renderRich(it)}</span>
        </div>
      ))}
    </div>
  )
}
```

</details>

---

## 族 M · 拓扑图族（6 个）

### `AnnotatedCycle` · v0.4

| | |
|---|---|
| 语义 | 标注环：N 节点沿圆周落位 + 顺时针弧箭头 + 中心标签（插图式，叙述性） |
| 何时用 | 闭环迭代，节点数 3–8 且需要主副标签 |
| 何时不用 | ≤4 节点的仪表盘式渐变环 → CycleFlowDiagram |
| 配套 | FigCaption, AnnotationPair |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 AnnotatedCycle（族 M 拓扑图族）实现该区块。

语义：标注环：N 节点沿圆周落位 + 顺时针弧箭头 + 中心标签（插图式，叙述性）
何时用：闭环迭代，节点数 3–8 且需要主副标签
何时不用：≤4 节点的仪表盘式渐变环 → CycleFlowDiagram
配套：FigCaption, AnnotationPair
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<AnnotatedCycle nodes={[{ label: '基因合成', sub: 'Synthesis' }]} center={{ label: '闭环交付' }} />
```

**配置代码**

```jsx
import { AnnotatedCycle } from './src/lib'

<AnnotatedCycle nodes={[{ label: '基因合成', sub: 'Synthesis' }]} center={{ label: '闭环交付' }} />
```

<details><summary>组件源码（topology.jsx · 67 行）</summary>

```jsx
export function AnnotatedCycle({ nodes = [], center, radius = 36, nodeWidth = 32, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const uid = String(useId()).replace(/[^a-zA-Z0-9]/g, '')
  const W = 180, H = 112, cx = W / 2, cy = H / 2 + 1
  const N = Math.max(nodes.length, 1)
  const pt = (i, r) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }
  }
  const pad = 0.34 // 弧线两端留白（弧度）
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ position: 'relative', width: '100%', height: `${H}mm` }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker id={`ach-${uid}`} markerWidth="5" markerHeight="5" refX="4.2" refY="2.5" orient="auto">
              <path d="M0 0 L5 2.5 L0 5 Z" fill={t.capsuleLight} />
            </marker>
          </defs>
          {nodes.map((_, i) => {
            if (nodes.length < 2) return null
            const a0 = pt(i, radius).a + pad
            const a1 = pt((i + 1) % N, radius).a - pad + (i === N - 1 ? Math.PI * 2 : 0)
            const p0 = { x: cx + radius * Math.cos(a0), y: cy + radius * Math.sin(a0) }
            const p1 = { x: cx + radius * Math.cos(a1), y: cy + radius * Math.sin(a1) }
            return (
              <path key={i}
                d={`M${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A${radius} ${radius} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`}
                fill="none" stroke={t.capsuleLight} strokeWidth="0.6"
                markerEnd={`url(#ach-${uid})`} />
            )
          })}
          {center && <circle cx={cx} cy={cy} r="17" fill={t.tint} stroke={t.capsuleLight} strokeWidth="0.5" />}
        </svg>

        {/* 节点：HTML 层按同一坐标系百分比定位，与 SVG 严格对齐（容器比例恒为 180:112） */}
        {nodes.map((nd, i) => {
          const p = pt(i, radius)
          return (
            <div key={i} style={{
              position: 'absolute', left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`,
              transform: 'translate(-50%,-50%)', width: `${nodeWidth}mm`, textAlign: 'center',
              background: '#fff', border: `0.75pt solid ${t.capsuleLight}`, borderRadius: '1.2mm',
              padding: '1.8mm 1.6mm',
            }}>
              <div style={{ fontSize: '8pt', fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{nd.label}</div>
              {nd.sub && (
                <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.3, marginTop: '0.5mm' }}>{nd.sub}</div>
              )}
            </div>
          )
        })}
        {center && (
          <div style={{
            position: 'absolute', left: '50%', top: `${(cy / H) * 100}%`, transform: 'translate(-50%,-50%)',
            textAlign: 'center', width: '30mm',
          }}>
            <div style={{ fontSize: '9pt', fontWeight: 700, color: t.functional, lineHeight: 1.25 }}>{center.label}</div>
            {center.sub && <div style={{ fontSize: '6.5pt', color: n.textSoft, marginTop: '0.5mm' }}>{center.sub}</div>}
          </div>
        )}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `BeadChain` · v0.4

| | |
|---|---|
| 语义 | 珠链：浅色粗轨道 + 一串实底圆珠骑在轨道上，标签在珠内 |
| 何时用 | 线性的实验动作序列（「我们是怎么做的」，亲和、过程感） |
| 何时不用 | 交付阶段 → StagePipelineChain；分几步 → NumberedStepFlow |
| 配套 | FigCaption |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 筛选流程页（实验动作形态）· v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 BeadChain（族 M 拓扑图族）实现该区块。

语义：珠链：浅色粗轨道 + 一串实底圆珠骑在轨道上，标签在珠内
何时用：线性的实验动作序列（「我们是怎么做的」，亲和、过程感）
何时不用：交付阶段 → StagePipelineChain；分几步 → NumberedStepFlow
配套：FigCaption
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BeadChain steps={[{ label: '裂解', en: 'Lysis' }]} />
```

**配置代码**

```jsx
import { BeadChain } from './src/lib'

<BeadChain steps={[{ label: '裂解', en: 'Lysis' }]} />
```

<details><summary>组件源码（topology.jsx · 30 行）</summary>

```jsx
export function BeadChain({ steps = [], size = 15, palette = 'tone', caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(steps.length, 1), palette)
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ position: 'relative', padding: '1mm 0' }}>
        {/* 轨道：与主色同色相、极浅，宽 4.4mm，两端止于首末珠心 */}
        <div style={{
          position: 'absolute', left: `${size / 2}mm`, right: `${size / 2}mm`, top: '50%',
          transform: 'translateY(-50%)', height: '4.4mm',
          background: mixWhite(t.functional, 0.84), borderRadius: '999px',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {steps.map((s, i) => {
            const c = s.color || ramp[i % ramp.length].base
            return (
              <div key={i} style={{
                width: `${size}mm`, height: `${size}mm`, borderRadius: '50%', flexShrink: 0,
                background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontWeight: 600, fontSize: '7.5pt', lineHeight: 1.22,
                padding: '1.2mm', boxSizing: 'border-box',
              }}>{renderRich(s.label)}</div>
            )
          })}
        </div>
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `HexChain` · v0.4

| | |
|---|---|
| 语义 | 六边形图标链 + ⊕ 连接符，语义 = 并列的条件项（A + B + C，无先后，缺一不可） |
| 何时用 | 「套餐包含什么」 / 产品组成 / 订购须知 |
| 何时不用 | 有先后 → NumberedStepFlow；线性单一流程 → IconFlowBar（用 ›） |
| 配套 | FigCaption |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p06 / p40 / p43「产品组成 / 订购须知」 |

**提示词**（直接复制）

```text
用本设计系统的 HexChain（族 M 拓扑图族）实现该区块。

语义：六边形图标链 + ⊕ 连接符，语义 = 并列的条件项（A + B + C，无先后，缺一不可）
何时用：「套餐包含什么」 / 产品组成 / 订购须知
何时不用：有先后 → NumberedStepFlow；线性单一流程 → IconFlowBar（用 ›）
配套：FigCaption
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<HexChain items={[{ icon: 'flask', label: '质粒构建', en: 'Plasmid' }]} />
```

**配置代码**

```jsx
import { HexChain } from './src/lib'

<HexChain items={[{ icon: 'flask', label: '质粒构建', en: 'Plasmid' }]} />
```

<details><summary>组件源码（topology.jsx · 43 行）</summary>

```jsx
export function HexChain({ items = [], connector = '+', palette = 'tone', size = 19, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(items.length, 1), palette)
  const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '1.4mm', flexWrap: 'wrap' }}>
        {items.map((it, i) => {
          const r = ramp[i % ramp.length]
          const c = it.color || r.base
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.4mm' }}>
              <div style={{ textAlign: 'center', width: `${size + 8}mm` }}>
                <div style={{
                  width: `${size}mm`, height: `${size * 1.08}mm`, background: c, clipPath: HEX,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                }}>
                  <Icon name={it.icon || 'check'} size={Math.round(size * 0.78)}
                    primary="#FFFFFF" secondary="rgba(255,255,255,0.7)" />
                </div>
                <div style={{
                  fontSize: '7.5pt', fontWeight: 600, color: '#333', marginTop: '1.6mm', lineHeight: 1.35,
                }}>{it.label}</div>
                {it.en && (
                  <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.35 }}>{it.en}</div>
                )}
              </div>
              {i < items.length - 1 && (
                <div style={{
                  width: '4.6mm', height: '4.6mm', borderRadius: '50%', flexShrink: 0,
                  background: t.capsuleLight, color: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '8pt',
                  marginTop: `${size * 0.4}mm`,
                }}>{connector}</div>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `NumberedStepFlow` · v0.4

| | |
|---|---|
| 语义 | 编号步骤流：大号实心圆（01–06，骑在盒顶）+ 同色描边盒 + 步间 › |
| 何时用 | 分几步、有先后（流程页主力） |
| 何时不用 | 无先后的并列 → HexChain；顶部实色条的正统框链 → FlowChain |
| 配套 | FigCaption, NoteBand |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA（编号圆用橙 #F09B40）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p89「DEL 建库和筛选的流程」 |

**提示词**（直接复制）

```text
用本设计系统的 NumberedStepFlow（族 M 拓扑图族）实现该区块。

语义：编号步骤流：大号实心圆（01–06，骑在盒顶）+ 同色描边盒 + 步间 ›
何时用：分几步、有先后（流程页主力）
何时不用：无先后的并列 → HexChain；顶部实色条的正统框链 → FlowChain
配套：FigCaption, NoteBand
来源配色：MCE 化合物库手册 深蓝 #2C6BAA（编号圆用橙 #F09B40）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<NumberedStepFlow steps={[{ no: '01', title: '序列设计', en: 'Design', desc: '密码子优化' }]} />
```

**配置代码**

```jsx
import { NumberedStepFlow } from './src/lib'

<NumberedStepFlow steps={[{ no: '01', title: '序列设计', en: 'Design', desc: '密码子优化' }]} />
```

<details><summary>组件源码（topology.jsx · 47 行）</summary>

```jsx
export function NumberedStepFlow({ steps = [], palette = 'tone', size = 'md', caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(steps.length, 1), palette)
  const d = size === 'sm' ? 11 : 14
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '2.4mm' }}>
        {steps.map((s, i) => {
          const c = s.color || ramp[i % ramp.length].base
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
              <div style={{
                position: 'relative', flex: 1, minWidth: 0, marginTop: `${d / 2}mm`,
                border: `0.75pt solid ${c}`, borderRadius: '2mm', background: '#fff',
                padding: '5.4mm 3mm 3.4mm', textAlign: 'center',
              }}>
                <div style={{
                  position: 'absolute', top: `-${d / 2}mm`, left: '50%', transform: 'translateX(-50%)',
                  width: `${d}mm`, height: `${d}mm`, borderRadius: '50%', background: c, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: size === 'sm' ? '8.5pt' : '9.5pt',
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.no != null ? s.no : String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: '9pt', fontWeight: 700, color: '#333', lineHeight: 1.35 }}>{s.title}</div>
                {s.en && (
                  <div style={{ fontSize: '7pt', fontWeight: 300, color: n.textSoft, marginTop: '0.8mm', lineHeight: 1.35 }}>{s.en}</div>
                )}
                {s.desc && (
                  <div style={{ fontSize: '7.5pt', color: n.text, lineHeight: 1.58, marginTop: '1.8mm' }}>
                    {renderRich(s.desc)}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  alignSelf: 'center', color: t.capsuleLight, fontWeight: 800, fontSize: '11pt',
                  padding: '0 0.6mm', flexShrink: 0,
                }}>›</div>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `PhaseBand` · v0.4

| | |
|---|---|
| 语义 | 阶段带：多段色带 + 上方括注（把若干段归入大阶段）+ 下方细轴 + 末端箭头 |
| 何时用 | 时间轴上的位置（「我们的服务覆盖第 3–5 段」） |
| 何时不用 | 流程步骤 → NumberedStepFlow / FlowChain（本组件表达「位置」，不是「步骤」） |
| 配套 | StagePipelineChain |
| **来源配色** | **MCE 化合物库手册 p44 七色相带（青绿→橙 递进）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p44 中带 |

**提示词**（直接复制）

```text
用本设计系统的 PhaseBand（族 M 拓扑图族）实现该区块。

语义：阶段带：多段色带 + 上方括注（把若干段归入大阶段）+ 下方细轴 + 末端箭头
何时用：时间轴上的位置（「我们的服务覆盖第 3–5 段」）
何时不用：流程步骤 → NumberedStepFlow / FlowChain（本组件表达「位置」，不是「步骤」）
配套：StagePipelineChain
来源配色：MCE 化合物库手册 p44 七色相带（青绿→橙 递进）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<PhaseBand stages={['发现', '临床前', '临床 I', '上市']} active={2} />
```

**配置代码**

```jsx
import { PhaseBand } from './src/lib'

<PhaseBand stages={['发现', '临床前', '临床 I', '上市']} active={2} />
```

<details><summary>组件源码（topology.jsx · 42 行）</summary>

```jsx
export function PhaseBand({ stages = [], phases = [], active, axis = true, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(stages.length, 1), 'tone')
  const activeSet = active == null ? null
    : Array.isArray(active) ? new Set(active) : new Set([active])
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {phases.length > 0 && (
        <div style={{ display: 'flex', marginBottom: '1.4mm', paddingLeft: '0mm' }}>
          {phases.map((p, i) => (
            <div key={i} style={{
              flex: p.span, textAlign: 'center', fontSize: '7.5pt', fontWeight: 600, color: '#333',
              paddingBottom: '1.2mm',
              borderBottom: `0.5pt solid ${n.ghost}`,
              borderLeft: i > 0 ? `0.5pt solid ${n.ghost}` : 'none',
            }}>{p.label}</div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex' }}>
        {stages.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', background: ramp[i % ramp.length].base, color: '#fff',
            fontSize: '7pt', fontWeight: 600, padding: '2.1mm 1mm', lineHeight: 1.3,
            opacity: activeSet && !activeSet.has(i) ? 0.32 : 1,
            borderRight: i < stages.length - 1 ? '0.6mm solid #fff' : 'none',
          }}>{s}</div>
        ))}
      </div>
      {axis && (
        <div style={{ position: 'relative', height: '3mm' }}>
          <svg viewBox="0 0 100 4" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <line x1="0" y1="1" x2="98.4" y2="1" stroke={t.capsuleDeep} strokeWidth="0.5" />
            <path d="M98.4 0 L100 1 L98.4 2 Z" fill={t.capsuleDeep} />
          </svg>
        </div>
      )}
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `ServiceNetworkMap` · v0.4

| | |
|---|---|
| 语义 | 服务网络图：网格化节点盒 + 边缘挂箭头，语义 = 上下游依赖（多入口 → 汇聚中枢 → 再分出） |
| 何时用 | 「我们能做哪些环节」的总图；枢纽型业务结构 |
| 何时不用 | 一条线的流程 → StagePipelineChain；链与环都表达不了时才用它 |
| 配套 | AnnotationPair, CategoryTagRow |
| **来源配色** | **MCE PROTAC 手册 深紫 #5A3A7D（类目条玫红 #DC5973）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-protac` · PROTAC 深紫（主色 `#5A3A7D`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE PROTAC p11 / 药物发现服务册「Building Blocks of Conjugates」 |

**提示词**（直接复制）

```text
用本设计系统的 ServiceNetworkMap（族 M 拓扑图族）实现该区块。

语义：服务网络图：网格化节点盒 + 边缘挂箭头，语义 = 上下游依赖（多入口 → 汇聚中枢 → 再分出）
何时用：「我们能做哪些环节」的总图；枢纽型业务结构
何时不用：一条线的流程 → StagePipelineChain；链与环都表达不了时才用它
配套：AnnotationPair, CategoryTagRow
来源配色：MCE PROTAC 手册 深紫 #5A3A7D（类目条玫红 #DC5973）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-protac（PROTAC 深紫 · 主色 #5A3A7D）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ServiceNetworkMap columns={3} nodes={[{ col: 1, row: 1, label: '质粒', arrow: 'right' }]} />
```

**配置代码**

```jsx
import { ServiceNetworkMap } from './src/lib'

<ServiceNetworkMap columns={3} nodes={[{ col: 1, row: 1, label: '质粒', arrow: 'right' }]} />
```

<details><summary>组件源码（topology.jsx · 57 行）</summary>

```jsx
export function ServiceNetworkMap({ columns = 3, nodes = [], captions = [], caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const grid = (o) => ({
    gridColumn: `${o.col} / span ${o.span || 1}`,
    gridRow: o.row,
  })
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: '8mm', rowGap: '9mm', alignItems: 'center',
      }}>
        {captions.map((c, i) => (
          <div key={`c${i}`} style={{ ...grid(c), textAlign: c.align || 'center' }}>
            <div style={{ fontSize: '7.5pt', fontWeight: 600, color: n.text, lineHeight: 1.5 }}>{c.cn}</div>
            {c.en && (
              <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.45, marginTop: '0.7mm' }}>{c.en}</div>
            )}
          </div>
        ))}
        {nodes.map((nd, i) => {
          const deep = nd.tone === 'deep'
          return (
            <div key={`n${i}`} style={{
              ...grid(nd), position: 'relative',
              background: deep ? t.functional : t.tint,
              color: deep ? '#fff' : t.functional,
              border: `0.75pt solid ${deep ? t.functional : t.capsuleLight}`,
              borderRadius: '1.2mm', padding: '2.6mm 2.4mm', textAlign: 'center',
            }}>
              <div style={{ fontSize: '8.5pt', fontWeight: 700, lineHeight: 1.35 }}>{nd.label}</div>
              {nd.en && (
                <div style={{
                  fontSize: '6.5pt', fontWeight: 300, lineHeight: 1.4, marginTop: '0.8mm',
                  opacity: deep ? 0.85 : 0.75,
                }}>{nd.en}</div>
              )}
              {(nd.arrow === 'right' || nd.arrow === 'both') && (
                <span style={{
                  position: 'absolute', right: '-5.6mm', top: '50%', transform: 'translateY(-50%)',
                  color: t.functional, fontWeight: 800, fontSize: '11pt', lineHeight: 1,
                }}>›</span>
              )}
              {(nd.arrow === 'down' || nd.arrow === 'both') && (
                <span style={{
                  position: 'absolute', bottom: '-6mm', left: '50%', transform: 'translateX(-50%)',
                  color: t.functional, fontWeight: 800, fontSize: '11pt', lineHeight: 1,
                }}>↓</span>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

---

## 族 N · 图解族（3 个）

### `FigurePanel` · v0.4

| | |
|---|---|
| 语义 | 图解统一外壳：标题 + 内容区 + 图注（同色相极浅底 + 0.5pt 细描边） |
| 何时用 | 一页放 2–3 张图时统一图形语言；插画 / 示意图的框 |
| 何时不用 | 原始数据图 → EvidenceGrid（EvidenceGrid 是直角平铺无框） |
| 配套 | FigCaption |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 各册插图区处理方式 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 FigurePanel（族 N 图解族）实现该区块。

语义：图解统一外壳：标题 + 内容区 + 图注（同色相极浅底 + 0.5pt 细描边）
何时用：一页放 2–3 张图时统一图形语言；插画 / 示意图的框
何时不用：原始数据图 → EvidenceGrid（EvidenceGrid 是直角平铺无框）
配套：FigCaption
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<FigurePanel title="LNP 结构" caption="图 3  四组分自组装">{插图}</FigurePanel>
```

**配置代码**

```jsx
import { FigurePanel } from './src/lib'

<FigurePanel title="LNP 结构" caption="图 3  四组分自组装">{插图}</FigurePanel>
```

<details><summary>组件源码（figures.jsx · 16 行）</summary>

```jsx
export function FigurePanel({ title, caption, children, tone = 'tint', pad = '4mm', style }) {
  const t = useTheme()
  const bg = tone === 'tint' ? mixWhite(t.functional, 0.94) : '#fff'
  const border = tone === 'none' ? 'none' : `0.5pt solid ${t.capsuleLight}`
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {title && (
        <div style={{ fontSize: '9pt', fontWeight: 600, color: '#333', marginBottom: '2.2mm', lineHeight: 1.35 }}>
          {title}
        </div>
      )}
      <div style={{ background: bg, border, borderRadius: '1.2mm', padding: pad }}>{children}</div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
```

</details>

### `LegendFigure` · v0.4

| | |
|---|---|
| 语义 | 三栏图例插图：1fr / auto / 1fr 网格，左右各列图例项，中间放图 |
| 何时用 | 靶点图 / 通路图 / 解剖图（图内标注与图例同色） |
| 何时不用 | 无图例的纯插图 → FigurePanel；缺图时渲染「待补插图」占位而非伪科学图 |
| 配套 | FigCaption, AnnotationPair |
| **来源配色** | **MCE 化合物库手册 深蓝 #2C6BAA** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| **锁定册** `manual` | `mce-library` · 化合物库深蓝（主色 `#2C6BAA`）—— 来源册里它就是这个色，**不要换册** |
| 来源证据 | MCE library p20 / p57「肿瘤免疫化合物库靶点举例」 |

**提示词**（直接复制）

```text
用本设计系统的 LegendFigure（族 N 图解族）实现该区块。

语义：三栏图例插图：1fr / auto / 1fr 网格，左右各列图例项，中间放图
何时用：靶点图 / 通路图 / 解剖图（图内标注与图例同色）
何时不用：无图例的纯插图 → FigurePanel；缺图时渲染「待补插图」占位而非伪科学图
配套：FigCaption, AnnotationPair
来源配色：MCE 化合物库手册 深蓝 #2C6BAA
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）
锁定册：mce-library（化合物库深蓝 · 主色 #2C6BAA）—— 该组件在来源册里就是这个色，不要换册

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<LegendFigure title="肿瘤免疫靶点" items={[{ label: 'PD-L1', side: 'left' }]} />
```

**配置代码**

```jsx
import { LegendFigure } from './src/lib'

<LegendFigure title="肿瘤免疫靶点" items={[{ label: 'PD-L1', side: 'left' }]} />
```

<details><summary>组件源码（figures.jsx · 4 行）</summary>

```jsx
export function LegendFigure({
  title, children, image, alt, items = [], artWidth = '58mm', artHeight = '42mm',
  palette = 'category', baseColor, caption, style,
}
```

</details>

### `SwatchLegend` · v0.4

| | |
|---|---|
| 语义 | 色卡图例：色块 + 标签 + 英文的图例网格（可横排可纵排） |
| 何时用 | 散点图 / 聚类图的图注行、能力色标、多产品配色对照 |
| 何时不用 | 类目胶囊标签 → CategoryTagRow |
| 配套 | ScatterClusterPanel |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 SwatchLegend（族 N 图解族）实现该区块。

语义：色卡图例：色块 + 标签 + 英文的图例网格（可横排可纵排）
何时用：散点图 / 聚类图的图注行、能力色标、多产品配色对照
何时不用：类目胶囊标签 → CategoryTagRow
配套：ScatterClusterPanel
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<SwatchLegend items={[{ color: '#7EC0EE', label: '质粒服务' }]} />
```

**配置代码**

```jsx
import { SwatchLegend } from './src/lib'

<SwatchLegend items={[{ color: '#7EC0EE', label: '质粒服务' }]} />
```

<details><summary>组件源码（figures.jsx · 19 行）</summary>

```jsx
export function SwatchLegend({ items = [], direction = 'row', align = 'flex-end', label = null, style }) {
  const n = useNeutral()
  const row = direction === 'row'
  return (
    <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: row ? 'wrap' : 'nowrap', gap: row ? '2mm 6mm' : '2mm', justifyContent: row ? align : 'flex-start', alignItems: 'center', margin: '3mm 0', ...style }}>
      {label && (
        <span style={{ fontSize: '7.5pt', fontWeight: 600, color: n.text, marginRight: '2mm' }}>{label}</span>
      )}
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.6mm', fontSize: '7pt', color: n.text, whiteSpace: 'nowrap' }}>
          <span style={{
            width: '2.6mm', height: '2.6mm', background: it.color, borderRadius: it.round ? '50%' : '0.3mm', flexShrink: 0,
          }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
```

</details>

---

## 族 O · 页眉页脚（3 个）

### `BrandHeaderBar` · v0.4

| | |
|---|---|
| 语义 | 内页页眉品牌条：左品牌 + 副行，右侧 meta 或自定义 JSX，可加下细线 |
| 何时用 | 每个内页的第一个子元素（Page 内部） |
| 何时不用 | 封面（Cover 自带品牌位）；注意 @page 无 margin box，页眉必须画在 .page 内部 |
| 配套 | Page, ContactFooterBand |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 BrandHeaderBar（族 O 页眉页脚）实现该区块。

语义：内页页眉品牌条：左品牌 + 副行，右侧 meta 或自定义 JSX，可加下细线
何时用：每个内页的第一个子元素（Page 内部）
何时不用：封面（Cover 自带品牌位）；注意 @page 无 margin box，页眉必须画在 .page 内部
配套：Page, ContactFooterBand
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<BrandHeaderBar brand="远泰生物" tagline="Yuantai Bio" meta="mRNA-LNP CDMO" rule />
```

**配置代码**

```jsx
import { BrandHeaderBar } from './src/lib'

<BrandHeaderBar brand="远泰生物" tagline="Yuantai Bio" meta="mRNA-LNP CDMO" rule />
```

<details><summary>组件源码（furniture.jsx · 31 行）</summary>

```jsx
export function BrandHeaderBar({ brand, tagline, meta, right, rule = true, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6mm',
      paddingBottom: rule ? '2.6mm' : 0,
      borderBottom: rule ? `0.6pt solid ${t.capsuleLight}` : 'none',
      marginBottom: '6mm', ...style,
    }}>
      <div style={{ minWidth: 0 }}>
        {brand && (
          <div style={{
            fontSize: '10pt', fontWeight: 800, color: t.functional,
            letterSpacing: '0.3px', lineHeight: 1.25,
          }}>{brand}</div>
        )}
        {tagline && (
          <div style={{ fontSize: '7.5pt', fontWeight: 300, color: n.text, marginTop: '0.9mm', lineHeight: 1.4 }}>
            {tagline}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {meta && (
          <div style={{ fontSize: '7.5pt', color: n.text, lineHeight: 1.55 }}>{meta}</div>
        )}
        {right}
      </div>
    </div>
  )
}
```

</details>

### `ContactFooterBand` · v0.4

| | |
|---|---|
| 语义 | 内页联系带：网页/电话/邮箱/地址 + 备注，横排 2–4 项 |
| 何时用 | 内页收口（例如服务页底部） |
| 何时不用 | 封底的整页联系页 → BackCover；tone=solid 慎用（内页实底深色破坏 R2） |
| 配套 | BrandHeaderBar, Page |
| **来源配色** | **MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）** |
| 来源脉 `src` | `mce` · MCE 皓元 |
| 来源证据 | MCE 五册逆向 · v0.4 批 |

**提示词**（直接复制）

```text
用本设计系统的 ContactFooterBand（族 O 页眉页脚）实现该区块。

语义：内页联系带：网页/电话/邮箱/地址 + 备注，横排 2–4 项
何时用：内页收口（例如服务页底部）
何时不用：封底的整页联系页 → BackCover；tone=solid 慎用（内页实底深色破坏 R2）
配套：BrandHeaderBar, Page
来源配色：MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
来源脉：MCE 皓元 —— 配色必须从该脉的主题取：mce-library（化合物库手册） / mce-discovery（药物发现服务） / mce-protac（PROTAC 手册） / mce-qms（质量管理体系） / mce-biochem（生化试剂）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<ContactFooterBand heading="联系我们" items={[{ type: 'mail', text: 'service@yuantai.com' }]} />
```

**配置代码**

```jsx
import { ContactFooterBand } from './src/lib'

<ContactFooterBand heading="联系我们" items={[{ type: 'mail', text: 'service@yuantai.com' }]} />
```

<details><summary>组件源码（furniture.jsx · 33 行）</summary>

```jsx
export function ContactFooterBand({ heading, items = [], tone = 'tint', columns, style }) {
  const t = useTheme(); const n = useNeutral()
  const icons = { web: 'globe', phone: 'phone', mail: 'mail', addr: 'pin' }
  const solid = tone === 'solid'
  const line = tone === 'line'
  const cols = columns || Math.min(Math.max(items.length, 1), 4)
  return (
    <div style={{
      margin: '5mm 0 0',
      background: solid ? t.functional : line ? 'transparent' : t.tint,
      borderTop: line ? `0.75pt solid ${t.functional}` : 'none',
      borderRadius: solid || !line ? '1.2mm' : 0,
      padding: line ? '3.4mm 0 0' : '3.4mm 4mm', ...style,
    }}>
      {heading && (
        <div style={{
          fontSize: '9pt', fontWeight: 700, color: solid ? '#fff' : '#333', marginBottom: '2.4mm',
        }}>{heading}</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2mm 5mm' }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.2mm', minWidth: 0 }}>
            <Icon name={icons[c.type] || 'globe'} size={13}
              primary={solid ? '#FFFFFF' : t.functional}
              secondary={solid ? '#FFFFFF' : t.capsuleLight}
              style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '8.5pt', color: solid ? '#fff' : n.text }}>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

</details>

### `Icon` · v0.1

| | |
|---|---|
| 语义 | 面性双色 SVG 图标（16 个内置名） |
| 何时用 | 卡片 / 列表 / 胶囊里的图标位 |
| 何时不用 | 裸放作装饰（R17 图标必入容器）；大幅装饰插画 → FigurePanel |
| 配套 | StatCardRow, IconFlowBar, IconFeatureList, ChipPillGrid |
| **来源配色** | **GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）** |
| 来源脉 `src` | `genscript` · GenScript 金斯瑞 |
| 来源证据 | GenScript 三册逆向 · R1–R13 期 |

**提示词**（直接复制）

```text
用本设计系统的 Icon（族 O 页眉页脚）实现该区块。

语义：面性双色 SVG 图标（16 个内置名）
何时用：卡片 / 列表 / 胶囊里的图标位
何时不用：裸放作装饰（R17 图标必入容器）；大幅装饰插画 → FigurePanel
配套：StatCardRow, IconFlowBar, IconFeatureList, ChipPillGrid
来源配色：GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
来源脉：GenScript 金斯瑞 —— 配色必须从该脉的主题取：blue（核酸服务手册） / red（细胞工程服务手册） / purple（蛋白&抗体服务手册） / wine（蛋白手册 · 抗体章）

硬约束：
· 配色取自**该组件的来源脉主题**，不得换成别的脉、也不得统一成蓝色（R23）；
· 不得在页面里写死 hex，一律从主题令牌派生（R4）；
· 一站一拓扑：同一语义全册只用这一种拓扑，不同语义不得共用（R14）；
· 唯一允许的文本高亮是行内加粗 **x**，不加色、不加底、不加下划线；
· 只允许用组件白名单里的组件，禁止自创一次性样式。

用法：
<Icon name="flask" size={22} />
```

**配置代码**

```jsx
import { Icon } from './src/lib'

<Icon name="flask" size={22} />
```

<details><summary>组件源码（icons.jsx · 10 行）</summary>

```jsx
export function Icon({ name, size = 24, primary, secondary, style }) {
  const t = useTheme()
  const [main, accent] = PATHS[name] || PATHS.flask
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d={main} fill={primary || t.capsuleDeep} />
      {accent && <path d={accent} fill={secondary || t.header} />}
    </svg>
  )
}
```

</details>

---
