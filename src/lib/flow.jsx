// 族 E 流程：表头条流程框链 / 图标流程条 / 分段色带时间轴 / Chevron 箭头带
// R9：定性流程下必跟定量时间轴
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

// ---------- E1 表头条流程框链（NA p3：白框 + 顶部实头条 + ">" 连接） ----------
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

// ---------- E2 图标流程条（CE p3：细描边大容器 + 面性图标 + ">") ----------
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

// ---------- E3 分段色带时间轴（段宽∝时长，同色递进，末端箭头+总周期） ----------
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

// ---------- E4 Chevron 箭头带（PA p15/p17：燕尾咬合，gradient 变体可做漏斗） ----------
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
