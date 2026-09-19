// 页面骨架 + 标题系统 + 胶囊棒装饰器 + 页码 + 脚注
import { useTheme, useNeutral } from './theme'

// ---------- A4 页面容器（210×297mm，内页白底版心） ----------
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
export function Sub({ children, style }) {
  const n = useNeutral()
  return (
    <div style={{ textAlign: 'center', color: n.text, fontSize: '9.5pt', marginBottom: '5mm', ...style }}>
      {children}
    </div>
  )
}

// ---------- G4 引导段落（通栏、两端对齐、正文灰） ----------
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
export function Footnotes({ items, style }) {
  const n = useNeutral()
  return (
    <div style={{ color: n.textSoft, fontSize: '7.5pt', lineHeight: 1.6, marginTop: '2.5mm', ...style }}>
      {items.map((s, i) => <div key={i}>* {s}</div>)}
    </div>
  )
}
