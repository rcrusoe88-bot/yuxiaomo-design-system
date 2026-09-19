// 数据与证据组件族 —— 源自 MCE 五册逆向
// 核心规则：图表默认单色，只有"两组对比"才允许引入第二色；图注在下、功能标题在右。
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

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
