// 族 D 卡片：卖点统计卡 / 三档套餐卡 / 客户反馈卡 / 结论横幅
// 共同签名：R6 右上大圆角（scoop）
// v0.4 追加 D5–D7（产品卡网格 / 大数字指标条 / 目录条目列表）
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'
import { renderRich } from './text'
import { pastelRamp } from './color'

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

/* =================================================================
 * v0.4 新增三件：产品卡网格 / 大数字指标条 / 目录条目列表
 * ================================================================= */

/* ---------------------------------------------------------------
 * D5 产品卡网格（ProductCardGrid）★产品明细页的主力版式
 * 复刻自 MCE PROTAC p5「Ligands for Target Proteins for PROTACs」：
 *   卡片 = 顶部类目条（实底 + 类目名 + 右侧两个几何小方块）
 *        + 目录号（次级灰小字）
 *        + 产品名（主题色 10pt）
 *        + 描述（8.5pt，靶点/基因名**行内加粗**）
 *
 * ✱ 为什么类目条默认同色相：MCE 该页三类目（Kinases / Epigenetic Factors / Others）
 *   其实是三条**同色相不同深浅**的玫红条，而不是红橙黄绿蓝——这才让它看起来是
 *   "一本手册"，而不是"一组便签"。需要跨色相时显式传 palette="category"，
 *   并在全册保持同一类目同一色（R22）。
 *
 * items: [{ category, code, name, desc, en }]
 * --------------------------------------------------------------- */
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

// 类目条上第二枚小方块：同色但压暗一档
const mixAlpha = (hex) => {
  const h = String(hex).replace('#', '')
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const k = parseInt(v, 16)
  const dim = (x) => Math.round(((k >> x) & 255) * 0.62)
  return '#' + [dim(16), dim(8), dim(0)].map(x => x.toString(16).padStart(2, '0')).join('')
}

/* ---------------------------------------------------------------
 * D6 大数字指标条（MetricStrip）★"数字前置"的紧凑表达
 * 复刻自 MCE 各册首屏的优势条（如"60,000+ 种生物活性化合物 / 2,600 万可筛选"）。
 * 与 StatCardRow 的分工：
 *   StatCardRow = 带图标 + 标题 + 描述的**卡片**（有 tint 底、占更大版面）
 *   MetricStrip = **纯数字**，靠上下两条 0.4pt 细线框住，项间竖线分隔
 *   → 需要"视觉上像一组数据"时用 MetricStrip；需要"像三张卖点卡"时用 StatCardRow。
 *
 * items: [{ value, unit, label, en }]
 * --------------------------------------------------------------- */
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

/* ---------------------------------------------------------------
 * D7 目录条目列表（TocList）★20 页以上手册的目录页
 * 编号（主题色）+ 标题（深灰）+ 英文副题（浅灰）+ **点线**引至页码。
 * 点线用 `borderBottom: dotted` 而非重复的 `.` 字符——后者在 PDF 导出时
 * 会因字距渲染而抖动成锯齿。
 * items: [{ no, title, en, page, level }]   level=2 时缩进为子条目
 * --------------------------------------------------------------- */
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
