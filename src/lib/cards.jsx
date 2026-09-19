// 族 D 卡片：卖点统计卡 / 三档套餐卡 / 客户反馈卡 / 结论横幅
// 共同签名：R6 右上大圆角（scoop）
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

const SCOOP = { borderRadius: '3mm', borderTopRightRadius: '9mm' }

// ---------- D1 卖点统计卡行（一行 3~4 张，tint 底 + 三段居中） ----------
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

// ---------- D3 三档套餐卡（基础/精选/高级） ----------
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

// ---------- F5 结论横幅（浅色 tint 版 / 实底 CTA 版） ----------
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

// ---------- D4 客户反馈卡（渐变面板 + 大引号 + 头像） ----------
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
