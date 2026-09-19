// 数据与证据组件族 —— 源自 MCE 五册逆向
// 核心规则：图表默认单色，只有"两组对比"才允许引入第二色；图注在下、功能标题在右。
// v0.4 追加 I4–I6（多面板参数条形图 / 注释甜甜圈 / 散点聚类面板）
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'
import { FigCaption, renderRich } from './text'
import { pastelRamp, mixWhite } from './color'

// 把最大值收成"好看的整刻度"
function niceMax(v, ticks) {
  if (!v) return ticks
  const rough = v / ticks
  const step = Math.pow(10, Math.floor(Math.log10(rough)))
  for (const m of [1, 2, 2.5, 5, 10]) {
    const s = step * m
    if (s * ticks >= v) return s * ticks
  }
  return step * 10 * ticks
}

// ---------- D1 排序条形图：顶部轴 + 右对齐类别标签 + 单色横条 + 右下加粗图注 ----------
// 用途：靶点举例 / 参数分布 / 品类计数。比饼图更易读，比 DataChart 更适合"单序列排行"。
/* @ds-contract
 * intent:   排序条形图：轴在顶部 + 右侧类标列 + 单色横条（替代饼图）
 * use:      单序列排行：靶点举例、参数分布、品类计数
 * notfor:   多面板小倍数 → PanelBarChart；构成占比 → AnnotatedDonut
 * pairs:    FigCaption
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <TargetBarChart items={[{ label: 'KRAS', value: 42 }]} caption="图 2  靶点分布" />
 */
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

// ---------- D2 仪器报告面板：浅色标题条容器，图与数据表同框 ----------
// 用途：QC 检测 / 方法学验证页——"色谱图 + 积分表"这类仪器输出。规则：保留仪器原生样式，只用统一色框"装框"。
// blocks: [{ label, chart } | { label, columns, rows, total }]
// 单元格支持 { v, rowSpan, colSpan } 以表达纵向合并（如 NO. 列）。
/* @ds-contract
 * intent:   仪器报告面板：浅色标题条 + 图与数据表同框，表内无竖线（技术语体）
 * use:      QC 检测数据、方法学、仪器报告页
 * notfor:   营销参数表 → SpecTable（R16：两种语体按页型选用，不可混页）
 * pairs:    MethodTable
 * hue:      MCE 五册 · 技术语体（浅底细线，不做实底反白）
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <InstrumentReportPanel blocks={[{ label: '粒径与 PDI', columns: ['批次', 'Z-avg'], rows: [['L1', '92 nm']] }]} />
 */
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

// 仪器报告表：无竖线、表头浅底、斑马纹、Total 行顶线——与 SpecTable 的实底表头明确区分
function ReportTable({ columns = [], rows = [], total }) {
  const t = useTheme(); const n = useNeutral()

  const renderCell = (cell, ci, extra = {}) => {
    const isObj = cell && typeof cell === 'object'
    const v = isObj ? cell.v : cell
    return (
      <td key={ci}
        rowSpan={isObj ? cell.rowSpan : undefined}
        colSpan={isObj ? cell.colSpan : undefined}
        style={{
          padding: '1.1mm 1.5mm',
          textAlign: ci === 0 ? 'center' : 'left',
          fontVariantNumeric: 'tabular-nums',
          borderBottom: `0.4pt solid ${n.line}`,
          ...extra,
        }}>{v}</td>
    )
  }

  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse', fontSize: '6.8pt', color: n.text, tableLayout: 'auto',
    }}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={{
              background: t.tint, fontWeight: 600, textAlign: i === 0 ? 'center' : 'left',
              padding: '1.2mm 1.5mm', borderBottom: `0.5pt solid ${t.capsuleLight}`, whiteSpace: 'nowrap',
            }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{ background: ri % 2 ? t.zebra : '#FFFFFF' }}>
            {r.map((cell, ci) => renderCell(cell, ci))}
          </tr>
        ))}
        {total && (
          <tr>
            {total.map((cell, ci) => renderCell(cell, ci, {
              fontWeight: 700, background: t.zebra, borderTop: `0.5pt solid ${t.capsuleLight}`,
            }))}
          </tr>
        )}
      </tbody>
    </table>
  )
}

// ---------- D3 文献引用块：标题 + 多栏流式引用（期刊名加粗、卷期页次级灰） ----------
// 用途：信任页——用同行评议背书，而不是 logo 墙。
// items: [{ journal, text }]
/* @ds-contract
 * intent:   文献引用块：期刊名加粗深灰 + 卷期页次级灰，CSS 多栏流式
 * use:      信任页的同行评议引用（R19：信任靠引用，不做 logo 墙）
 * notfor:   客户评价 → TestimonialCard
 * pairs:    TestimonialCard
 * hue:      MCE 化合物库手册 橙 #F09B40（编号 / 文献专用）
 * evidence: MCE 五册逆向 · R19
 * since:    v0.3
 * usage:    <CitationBlock items={[{ journal: 'Nat Rev Drug Discov', text: '2023;22:1–18' }]} />
 */
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

/* =================================================================
 * v0.4 新增三种图表：多面板参数条形图 / 注释甜甜圈 / 散点聚类面板
 *
 * 图表选型决策（务必按此选，不要凭手感）：
 *   「一个」指标做排行          → TargetBarChart（单序列，轴在顶）
 *   「多个」指标做同构对比      → PanelBarChart（小倍数，竖基线，可共享刻度）
 *   构成占比且要解释每一块      → AnnotatedDonut
 *   分布/聚类形状本身就是信息  → ScatterClusterPanel
 *   两组的同一指标做对比        → DataChart
 * ================================================================= */

/* ---------------------------------------------------------------
 * I4 多面板参数条形图（PanelBarChart）★理化参数分布页
 * 复刻自 MCE library p45「片段化合物库相关参数」：2×2 面板，
 *   每面板 = 顶部刻度行 + 左侧类别标签列 + **竖基线** + 横条，
 *   底部可选功能标题（如"分子量相关参数"）。
 * 与 TargetBarChart 的两处硬差别：
 *   ① 本组件的读法轴是**左侧竖基线**（读数向右），TargetBarChart 的轴在**顶部通栏**；
 *   ② 本组件是**小倍数**（同构多图），TargetBarChart 是单图。
 * sharedScale=true 时所有面板共用同一 max —— 只有这时才能横向比较面板之间的量级，
 *   这是"四个面板看起来一样高"这类误读的唯一解药。
 *
 * panels: [{ title, items: [{ label, value, color }], note }]
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   小倍数面板条形图：竖基线 + 顶部刻度 + 左类标的多面板（同构多图）
 * use:      理化参数分布页；需要多个同构图并排
 * notfor:   单图排行 → TargetBarChart；注意多面板必须开 sharedScale
 * pairs:    FigCaption, NoteBand
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * evidence: MCE library p45「片段化合物库相关参数」
 * since:    v0.4
 * usage:    <PanelBarChart panels={[{ title: '分子量', items: [{ label: 'A', value: 12 }] }]} sharedScale />
 */
export function PanelBarChart({
  panels = [], columns = 2, ticks = 4, barColor, labelWidth = '15mm',
  sharedScale = false, barHeight = '4.4mm', caption, style,
}) {
  const allMax = Math.max(...panels.flatMap(p => (p.items || []).map(i => i.value)), 1)
  const shared = sharedScale ? niceMax(allMax, ticks) : null
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '7mm 9mm' }}>
        {panels.map((p, i) => (
          <BarPanel key={i} panel={p} ticks={ticks} barColor={barColor}
            labelWidth={labelWidth} barHeight={barHeight} sharedMax={shared} />
        ))}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

function BarPanel({ panel, ticks, barColor, labelWidth, barHeight, sharedMax }) {
  const t = useTheme(); const n = useNeutral()
  const items = panel.items || []
  if (!items.length) return null
  const max = sharedMax || niceMax(Math.max(...items.map(i => i.value)), ticks)
  const scale = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max / ticks) * i))

  return (
    <div>
      {panel.title && (
        <div style={{ fontSize: '9pt', fontWeight: 600, color: '#333', marginBottom: '2.4mm', lineHeight: 1.35 }}>
          {panel.title}
        </div>
      )}
      {/* 顶部刻度行：与条形区同宽，因此刻度值与条长严格对齐 */}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ flex: `0 0 ${labelWidth}` }} />
        <div style={{
          flex: 1, display: 'flex', justifyContent: 'space-between',
          fontSize: '6.5pt', color: n.textSoft, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>
          {scale.map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '0.6mm' }}>
        <div style={{ flex: `0 0 ${labelWidth}` }}>
          {items.map((it, i) => (
            <div key={i} style={{
              height: barHeight, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: '2mm', fontSize: '6.8pt', color: n.text,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{it.label}</div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0, borderLeft: `0.5pt solid ${n.textSoft}` }}>
          {items.map((it, i) => (
            <div key={i} style={{ height: barHeight, display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: `${Math.max((it.value / max) * 100, 0.8)}%`, height: `calc(${barHeight} - 1.6mm)`,
                background: it.color || barColor || t.functional,
              }} />
            </div>
          ))}
        </div>
      </div>
      {panel.note && (
        <div style={{ fontSize: '7pt', color: n.textSoft, textAlign: 'center', marginTop: '2mm' }}>{panel.note}</div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------
 * I5 注释甜甜圈（AnnotatedDonut）★"我们有什么"的总览页
 * 复刻自 MCE library p3「药物发现」：中心双行标签 + N 段环 +
 *   环外侧的**同色标题注解块**（每块 = 彩色标题 + 圆点清单）。
 * 关键细节（MCE 的"类目色恒定"实证）：注解块标题色 == 对应扇区色，
 *   读者不需要引线也能完成配对；引线只作辅助。
 *
 * ✱ palette 默认 "category"（跨色相）：甜甜圈的各段本就是不同类目，
 *   同色相会让读者无法区分。这是 R22 允许的显式例外，但要求：
 *   同一类目在全册任何页保持同一色（传入 segment.color 固定）。
 *
 * segments: [{ label, points: [], side: 'left'|'right', color }]
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   注释甜甜圈：中心双行标签 + N 段环 + 环外侧同色标题注解块（注解块标题色 == 扇区色）
 * use:      构成占比 + 逐块解释（「我们有什么」的总览页）
 * notfor:   排序比较 → TargetBarChart；palette 默认 category 是 R22 的显式例外
 * pairs:    FigCaption, AnnotationPair
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * evidence: MCE library p3「药物发现」
 * since:    v0.4
 * usage:    <AnnotatedDonut segments={[{ label: '质粒服务', points: ['酶切图谱', '全长测序'] }]} />
 */
export function AnnotatedDonut({
  segments = [], center, size = 62, thickness = 20, palette = 'category', caption, style,
}) {
  const t = useTheme(); const n = useNeutral()
  const ramp = pastelRamp(t.functional, Math.max(segments.length, 1), { spread: palette === 'category' ? 1 : 0 })
  const colors = segments.map((s, i) => s.color || ramp[i % ramp.length].base)
  const total = segments.length || 1
  const rOut = 46
  const rIn = rOut - Math.max(8, Math.min(thickness, 30))
  const gapA = total > 1 ? 0.03 : 0
  const left = segments.map((s, i) => ({ s, i })).filter(({ s, i }) => (s.side || (i % 2 === 0 ? 'left' : 'right')) === 'left')
  const right = segments.map((s, i) => ({ s, i })).filter(({ s, i }) => (s.side || (i % 2 === 0 ? 'left' : 'right')) === 'right')

  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4mm', alignItems: 'center' }}>
        <DonutLegend items={left} colors={colors} align="right" />
        <div style={{ position: 'relative', width: `${size}mm`, height: `${size}mm`, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {segments.map((_, i) => {
              const a0 = -Math.PI / 2 + (i / total) * Math.PI * 2 + gapA / 2
              const a1 = -Math.PI / 2 + ((i + 1) / total) * Math.PI * 2 - gapA / 2
              return <path key={i} d={arcPath(50, 50, rOut, rIn, a0, a1)} fill={colors[i]} />
            })}
          </svg>
          {center && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 8mm',
            }}>
              <div style={{ fontSize: '11pt', fontWeight: 700, color: '#333', lineHeight: 1.25 }}>{center.label}</div>
              {center.sub && <div style={{ fontSize: '7pt', color: n.textSoft, marginTop: '0.8mm' }}>{center.sub}</div>}
            </div>
          )}
        </div>
        <DonutLegend items={right} colors={colors} align="left" />
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

function DonutLegend({ items, colors, align }) {
  const n = useNeutral()
  const right = align === 'right'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4mm' }}>
      {items.map(({ s, i }) => (
        <div key={i} style={{ borderRight: right ? `0.75pt solid ${colors[i]}` : 'none', paddingRight: right ? '3mm' : 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1.6mm', marginBottom: '1.4mm',
            justifyContent: right ? 'flex-end' : 'flex-start',
          }}>
            {!right && <span style={{ width: '2.6mm', height: '2.6mm', background: colors[i], flexShrink: 0 }} />}
            <span style={{ fontSize: '9pt', fontWeight: 700, color: colors[i], lineHeight: 1.3 }}>{s.label}</span>
            {right && <span style={{ width: '2.6mm', height: '2.6mm', background: colors[i], flexShrink: 0 }} />}
          </div>
          <ul style={{
            margin: 0, paddingLeft: '4.2mm', color: n.text, fontSize: '7pt',
            lineHeight: 1.62, listStyle: 'disc', textAlign: 'left',
          }}>
            {(s.points || []).map((p, j) => <li key={j} style={{ marginBottom: '0.4mm' }}>{renderRich(p)}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

// 甜甜圈扇区路径（外弧 → 内弧闭合）
function arcPath(cx, cy, rO, rI, a0, a1) {
  const P = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const large = a1 - a0 > Math.PI ? 1 : 0
  const [x0, y0] = P(rO, a0); const [x1, y1] = P(rO, a1)
  const [x2, y2] = P(rI, a1); const [x3, y3] = P(rI, a0)
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${rO} ${rO} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
    + ` L${x2.toFixed(2)} ${y2.toFixed(2)} A${rI} ${rI} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`
}

/* ---------------------------------------------------------------
 * I6 散点聚类面板（ScatterClusterPanel）★化学空间 / 分布形态
 * 复刻自 MCE library p44 上带：一片散点云 + 半透明聚类色块 + 横排色块图例。
 * 语义：**分布形状本身就是信息**——用条形图会把这个信息压掉。
 * points 省略时按种子确定性生成（同一份数据每次渲染结果一致，避免 PDF 与预览不符）。
 *
 * points:   [{ x, y, group }]        坐标为 0–100 的百分比空间
 * clusters: [{ x, y, r, color }]     半透明聚类色块
 * legend:   [{ label, color }]
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   散点聚类面板：散点云 + 半透明聚类色块 + 色块图例（分布形态本身就是信息）
 * use:      化学空间、分布形态、聚类与离散
 * notfor:   精确数值比较 → TargetBarChart / DataChart；points 省略时按 seed 确定性生成
 * pairs:    SwatchLegend, FigCaption
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * evidence: MCE library p44 上带
 * since:    v0.4
 * usage:    <ScatterClusterPanel clusters={[{ x: 40, y: 55, r: 18 }]} legend={[{ label: 'A 类', color: '#7EC0EE' }]} seed={7} />
 */
export function ScatterClusterPanel({
  points, clusters = [], legend = [], height = 46, dot = 1.5,
  palette = 'category', seed = 7, caption, style,
}) {
  const t = useTheme(); const n = useNeutral()
  const pts = points || generateCloud(seed, 220)
  const groups = [...new Set(pts.map(p => p.group ?? 0))].sort()
  const ramp = pastelRamp(t.functional, Math.max(groups.length, 1), { spread: palette === 'category' ? 1 : 0 })
  const colorOf = (g) => ramp[Math.max(groups.indexOf(g ?? 0), 0) % ramp.length].base
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ position: 'relative', width: '100%', height: `${height}mm`, background: '#fff' }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {clusters.map((c, i) => (
            <circle key={`c${i}`} cx={c.x} cy={c.y} r={c.r} fill={c.color || t.capsuleLight} fillOpacity="0.22" />
          ))}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={dot} fill={p.color || colorOf(p.group)}
              fillOpacity={p.dim ? 0.5 : 0.92} />
          ))}
        </svg>
      </div>
      <div style={{ borderBottom: `0.4pt solid ${n.line}` }} />
      {legend.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm 6mm', marginTop: '2.4mm', justifyContent: 'flex-end' }}>
          {legend.map((l, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.6mm', fontSize: '7pt', color: n.text }}>
              <span style={{ width: '2.4mm', height: '2.4mm', background: l.color, flexShrink: 0 }} />{l.label}
            </span>
          ))}
        </div>
      )}
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

// 确定性散点云：LCG 伪随机，保证每次渲染完全一致（PDF 与预览不得有差异）
function generateCloud(seed, count) {
  let s = seed
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const out = []
  for (let i = 0; i < count; i++) {
    const g = i % 4
    const cx = [22, 52, 74, 34][g]
    const cy = [68, 30, 62, 22][g]
    const r = 14 + rnd() * 10
    const a = rnd() * Math.PI * 2
    const d = Math.sqrt(rnd()) * r
    out.push({
      x: Math.max(2, Math.min(98, cx + d * Math.cos(a))),
      y: Math.max(2, Math.min(98, cy + d * Math.sin(a))),
      group: g,
    })
  }
  return out
}
