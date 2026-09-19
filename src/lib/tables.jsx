// 族 C 表格：R5 —— 表头实底+白字+白缝+顶角圆；表体仅横线+斑马纹
// cells 支持 { v, rowSpan, colSpan, highlight, bold, label }
import { useTheme, useNeutral } from './theme'

/**
 * columns: string[] 表头
 * rows: 单元格数组（字符串或 {v,rowSpan,colSpan,highlight,bold}）
 *   —— 用 null 占位被合并的格子
 * labelColumn: 首列渲染为标签列（tint 底、黑粗）
 * zebra: 斑马纹（默认开）
 */
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

/** C3 三档色阶矩阵表：列头同色系深浅递进（颜色深浅 = 承诺强度）*/
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

/** C2 变体：通栏产品名合并头行（CE p8 五阶段表）*/
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
