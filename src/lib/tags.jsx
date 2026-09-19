// 标签 / 芯片 / 图标列表族 —— 源自 MCE 五册逆向
// 核心规则「同色系自配」：任何彩色元素都是"浅色底 + 同色相深一阶字"，从不跨色相配对。
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'
import { pastelRamp } from './color'

// ---------- T1 类目胶囊标签行：水平自动换行的圆角胶囊，同色系浅底深字 ----------
// 用途：产品/样本的适用性标记（如"小分子抑制剂 / GMP 产品 / 标准品 / 同位素"）。
// 色相由主题主色派生，因此换主题自动换肤；也可用 item.color 指定固定类目色。
/* @ds-contract
 * intent:   类目胶囊标签行：水平自动换行的圆角胶囊（浅底 + 同色相深一阶字）
 * use:      类目 / 标签横排；子能力概览
 * notfor:   子能力的长清单 → ChipPillGrid；图例色标 → SwatchLegend
 * pairs:    ProductCardGrid, ServiceNetworkMap
 * hue:      MCE 质量管理体系 青 tint #C1E7ED（源色 青 #41B3B9）
 * src:       mce
 * manual:    mce-qms
 * evidence: MCE 五册逆向 · R21
 * since:    v0.3
 * usage:    <CategoryTagRow items={[{ label: '质粒服务', color: '#C1E7ED' }]} />
 */
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

// ---------- T2 芯片标签网格：浅底圆角芯片 + 行内小图标，2–3 列 ----------
// 用途：子能力清单（如"分子砌块 / 对照品 / 中间体 / 化学试剂"）。比纯列表更有容器感。
/* @ds-contract
 * intent:   芯片标签网格：浅底圆角芯片 + 行内小图标（2–3 列）
 * use:      子能力清单
 * notfor:   需要图标 + 详细说明的特性 → IconFeatureList
 * pairs:    IconFeatureList
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <ChipPillGrid items={[{ label: '无菌灌装', icon: 'shield' }]} />
 */
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

// ---------- T3 图标特性列表：实心彩圆图标 + 彩色标题 + 圆点列表 ----------
// 用途：三段式资质/优势页（左图标列表 + 右证据）中的左栏。
// 规则：线性图标从不裸放，永远装在实心圆容器里；容器色即语义色。
// items: [{ icon, title, points: [], text }]
/* @ds-contract
 * intent:   图标特性列表：实心彩圆图标 + 彩色标题 + 圆点列表（R17 图标必入容器）
 * use:      能力 / 特性的详细说明
 * notfor:   短标签 → ChipPillGrid；卖点卡 → StatCardRow
 * pairs:    ChipPillGrid
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · R17
 * since:    v0.3
 * usage:    <IconFeatureList items={[{ icon: 'flask', title: '工艺开发', points: ['DOE 优化'] }]} />
 */
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
