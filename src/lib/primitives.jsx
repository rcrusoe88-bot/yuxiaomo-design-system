// 页面骨架 + 标题系统 + 胶囊棒装饰器 + 页码 + 脚注
import { useTheme, useNeutral } from './theme'

// ---------- A4 页面容器（210×297mm，内页白底版心） ----------
/* @ds-contract
 * intent:   A4 页面根容器（210×297mm），自动渲染页码
 * use:      每一个内页的最外层
 * notfor:   封面 / 封底（Cover / BackCover 自带页面，不要再套 Page）
 * pairs:    BrandHeaderBar, ContactFooterBand, Folio（内置）
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <Page number={4} folioSide="right">{页面内容}</Page>
 */
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

// ---------- G1 页码：`- 0X -`，奇偶左右交替 ----------
/* @ds-contract
 * intent:   页码（– 0X –，奇偶左右交替）
 * use:      通常由 Page 自动渲染，无需手写
 * notfor:   手写页码（会与 Page 内置的重复）
 * pairs:    Page
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <Folio num={4} side="right" />
 */
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

// ---------- R3：45° 胶囊棒装饰器（SVG，4 档色 × N 根 × 45°，100% 不透明平涂） ----------
// sticks: [{ x, y, len, thick, color }] 或直接数量生成自动排布
/* @ds-contract
 * intent:   装饰原语：45° 等距平行胶囊棒束（母题 E01），按 d = x − y 定位
 * use:      通常由 Cover / BackCover / SectionDivider 内部调用；确需自定义布点时才直接用
 * notfor:   内页正文区当装饰（破坏 R2 内页不出深色块）
 * pairs:    Cover, BackCover, SectionDivider
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <CapsuleDecor preset="divider" />
 */
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

// ---------- B1 页胶囊标题（R4：一页一个，实底 stadium，白字居中） ----------
/* @ds-contract
 * intent:   实底 stadium 胶囊页题（白字居中）——视觉上是「句号」
 * use:      强承诺型页题；单点 CTA 页
 * notfor:   一页出现第 2 个（R3 一页一胶囊）；分栏并列可重复的段落标题 → BlockTitle
 * pairs:    Lead, Sub
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <PillTitle width="120mm">端到端 mRNA-LNP 开发服务</PillTitle>
 */
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

// ---------- B2 小节标题（主题色粗体居中，无底无装饰） ----------
/* @ds-contract
 * intent:   主题色粗体居中二级标题，无底无装饰
 * use:      需要中置的小节标题
 * notfor:   左对齐正文流里的小节 → BarTitle；页题 → H1 系列（PillTitle/BlockTitle/PairTitle）
 * pairs:    Sub
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <H2>服务流程</H2>
 */
export function H2({ children, style }) {
  const t = useTheme()
  return (
    <div style={{
      textAlign: 'center', color: t.functional, fontWeight: 700,
      fontSize: '13.5pt', margin: '7mm 0 2.5mm', ...style,
    }}>{children}</div>
  )
}

// ---------- H2 下的灰色定位句 ----------
/* @ds-contract
 * intent:   H2 下方的灰色定位句（一句补充，不展开）
 * use:      紧贴 H2 的补充定位
 * notfor:   独立段落 → Lead / BodyText
 * pairs:    H2
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <Sub>从序列设计到制剂灌装</Sub>
 */
export function Sub({ children, style }) {
  const n = useNeutral()
  return (
    <div style={{ textAlign: 'center', color: n.text, fontSize: '9.5pt', marginBottom: '5mm', ...style }}>
      {children}
    </div>
  )
}

// ---------- G4 引导段落（通栏、两端对齐、正文灰） ----------
/* @ds-contract
 * intent:   通栏引导段落（两端对齐，页题下的第一段导语）
 * use:      页题之下的开篇导语
 * notfor:   多段落正文 → BodyText（Lead 一段就够）
 * pairs:    PillTitle, H2
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <Lead>作为一站式 CDMO 服务商，我们覆盖质粒、mRNA 与 LNP 全链条。</Lead>
 */
export function Lead({ children, style }) {
  const n = useNeutral()
  return (
    <p style={{
      color: n.text, fontSize: '9.5pt', lineHeight: 1.7, textAlign: 'justify',
      margin: '0 0 5mm', ...style,
    }}>{children}</p>
  )
}

// ---------- G3 脚注块（* 开头、次级灰、与表左缘对齐） ----------
/* @ds-contract
 * intent:   页脚 * 开头的灰色小字（数据口径 / 免责说明）
 * use:      页脚最末的口径说明、适用范围
 * notfor:   版心内的关键提醒 → NoteBand（Footnotes 只在页脚，且最轻）
 * pairs:    Page
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * src:       neutral
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <Footnotes items={['* 数据为示例，不构成承诺。']} />
 */
export function Footnotes({ items, style }) {
  const n = useNeutral()
  return (
    <div style={{ color: n.textSoft, fontSize: '7.5pt', lineHeight: 1.6, marginTop: '2.5mm', ...style }}>
      {items.map((s, i) => <div key={i}>* {s}</div>)}
    </div>
  )
}
