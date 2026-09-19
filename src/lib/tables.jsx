// 族 C 表格：R5 —— 表头实底+白字+白缝+顶角圆；表体仅横线+斑马纹
// cells 支持 { v, rowSpan, colSpan, highlight, bold, label }
// v0.4 追加 C4–C6（行标签矩阵 / 方法对照 / 键值属性），语体分工见文件中部注释。
import { useTheme, useNeutral } from './theme'
import { renderRich } from './text'

/**
 * columns: string[] 表头
 * rows: 单元格数组（字符串或 {v,rowSpan,colSpan,highlight,bold}）
 *   —— 用 null 占位被合并的格子
 * labelColumn: 首列渲染为标签列（tint 底、黑粗）
 * zebra: 斑马纹（默认开）
 */
/* @ds-contract
 * intent:   实底反白表头的参数表（营销语体），R5 无竖线 + 斑马纹
 * use:      卖点、档位、承诺数字、产品参数（营销语境）
 * notfor:   技术检测数据 → InstrumentReportPanel（R16 两种语体不可混页）
 * pairs:    ProductHeaderRow, TierMatrixTable
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R5 / R8
 * since:    v0.1
 * usage:    <SpecTable columns={['项目', '规格']} rows={[['粒径', '80–120 nm']]} labelColumn />
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
/* @ds-contract
 * intent:   三档色阶矩阵表：列头同色系深浅递进（深浅 = 承诺强度）
 * use:      RUO / IND / cGMP 这类档位 × 特性的对照
 * notfor:   单档参数清单 → SpecTable；三档套餐报价 → TierCards
 * pairs:    SpecTable
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * src:       genscript
 * evidence: GenScript 三册逆向 · R6
 * since:    v0.1
 * usage:    <TierMatrixTable tiers={['RUO', 'IND', 'cGMP']} features={[{ name: '方法学验证', values: [false, true, true] }]} />
 */
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
/* @ds-contract
 * intent:   通栏产品名合并头行（放进 SpecTable 的 rows 里作分段）
 * use:      大表内按产品分段
 * notfor:   独立成表；跨页续表头 → 用表头本身
 * pairs:    SpecTable
 * hue:      GenScript 手册 p8 五阶段表
 * src:       genscript
 * evidence: GenScript 手册 p8 五阶段表
 * since:    v0.1
 * usage:    <ProductHeaderRow title="mRNA 疫苗" colSpan={4} />
 */
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

/* =================================================================
 * 以下为 v0.4 新增：源自 MCE 逆向的三种**非营销**表格语体。
 *
 * 至此本系统的表格共 **四种语体**，按"页型"选用，不可混：
 *   SpecTable            实底反白表头   → 营销参数表（卖点导向）
 *   TierMatrixTable      列头深浅递进   → 档位对比（承诺强度导向）
 *   InstrumentReportPanel 浅底细线      → 仪器/技术数据表（证据导向）
 *   RowLabelMatrixTable  行标签 + 图片列头 → 多产品横向规格对比（选型导向）
 *   MethodTable          左列术语双语   → 方法/用途对照（知识导向）
 *   KeyValueTable        无表头键值纵排 → 产品属性栏（信息导向）
 * ================================================================= */

/* ---------------------------------------------------------------
 * C4 行标签矩阵表（RowLabelMatrixTable）★多产品横向选型首选
 * 复刻自 MCE library p7「化合物库常规参数」：
 *   行 = 参数名（左列 tint 底、居中、加粗），列 = 被测产品（列头可放产品图）。
 * 什么时候用它而不是 SpecTable？
 *   SpecTable 的行是"产品"，列是"参数"——适合逐行读一家；
 *   本组件的行是"参数"，列是"产品"——适合**横向比同档位**（选型场景）。
 *
 * columns: [{ label, sub, image, en }]   —— image 走 base64 内联，导出 PDF 才不丢图
 * rows:    [{ label, en, cells: [] }]    —— cell 支持 { v,rowSpan,colSpan,highlight,bold,align }
 * divider: 默认 false（守 R5 无竖线）；列数 >3 的宽矩阵可开，用 0.4pt 极浅竖线辅助对齐
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   行标签矩阵表：行 = 参数（左列 tint 底加粗），列 = 被测产品，列头可挂图
 * use:      多产品 × 多参数的横向选型对照
 * notfor:   逐行读一家的参数清单 → SpecTable（SpecTable 的行是产品，列是参数）
 * pairs:    SpecTable（相邻页互为补充）
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * src:       mce
 * manual:    mce-library
 * evidence: MCE library p7「化合物库常规参数」
 * since:    v0.4
 * usage:    <RowLabelMatrixTable columns={[{ label: 'A 产品' }]} rows={[{ label: '粒径', cells: ['92 nm'] }]} />
 */
export function RowLabelMatrixTable({
  labelHeader = '', labelWidth = '34mm', columns = [], rows = [],
  fontSize = '8pt', divider = false, style,
}) {
  const t = useTheme(); const n = useNeutral()
  const cellBorder = (ci) => ({
    borderBottom: `0.4pt solid ${n.line}`,
    borderLeft: divider && ci > 0 ? `0.4pt solid ${n.line}` : 'none',
  })
  return (
    <table style={{
      width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
      fontSize, color: n.text, ...style,
    }}>
      <colgroup>
        <col style={{ width: labelWidth }} />
        {columns.map((_, i) => <col key={i} />)}
      </colgroup>
      <thead>
        <tr>
          <th style={{
            textAlign: 'left', verticalAlign: 'bottom', padding: '1.8mm 2.4mm',
            fontSize: '7.5pt', fontWeight: 600, color: n.textSoft,
            borderBottom: `0.75pt solid ${t.functional}`,
          }}>{labelHeader}</th>
          {columns.map((c, i) => (
            <th key={i} style={{
              textAlign: 'center', verticalAlign: 'bottom', padding: '2mm 2.4mm',
              borderBottom: `0.75pt solid ${t.functional}`,
              borderLeft: divider && i > 0 ? `0.4pt solid ${n.line}` : 'none',
            }}>
              {c.image && (
                <div style={{ marginBottom: '1.6mm' }}>
                  <img src={c.image} alt="" style={{ maxWidth: '100%', maxHeight: '16mm', objectFit: 'contain' }} />
                </div>
              )}
              {c.label && (
                <div style={{ fontWeight: 700, fontSize: '9pt', color: '#333', lineHeight: 1.35 }}>{c.label}</div>
              )}
              {c.sub && (
                <div style={{
                  fontWeight: 400, fontSize: '7pt', color: n.textSoft, marginTop: '0.7mm', lineHeight: 1.4,
                }}>{c.sub}</div>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            <td style={{
              background: t.tint, textAlign: 'center', verticalAlign: 'middle',
              padding: '2mm 2.4mm', fontWeight: 700, fontSize: '8.5pt', color: '#333',
              lineHeight: 1.45, borderBottom: `0.4pt solid ${n.line}`,
            }}>
              {r.label}
              {r.en && (
                <div style={{ fontWeight: 400, fontSize: '6.5pt', color: n.textSoft, marginTop: '0.7mm' }}>{r.en}</div>
              )}
            </td>
            {(r.cells || []).map((cell, ci) => {
              if (cell === null) return null
              const o = typeof cell === 'object' ? cell : { v: cell }
              return (
                <td key={ci}
                  rowSpan={o.rowSpan} colSpan={o.colSpan}
                  style={{
                    ...cellBorder(ci),
                    padding: '2mm 2.4mm', verticalAlign: 'middle', lineHeight: 1.58,
                    textAlign: o.align || 'center',
                    background: o.highlight ? t.tint : '#fff',
                    color: o.highlight ? t.functional : n.text,
                    fontWeight: o.bold || o.highlight ? 700 : 400,
                  }}>{o.v}</td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------------------------------------------------------------
 * C5 方法对照表（MethodTable）★服务/检测能力页
 * 复刻自 MCE library p8「常用分子水平检测方法」：
 *   左列 = 中文方法名 + 英文缩写（Roboto 混排、次级灰、另起一行），右列 = 用途描述。
 * 语言纪律（本系统核心）：中文与英文缩写**分行**，绝不写成 `时间分辨荧光共振能量转移(TR-FRET)`
 *   这样把括号塞在中文中间——那会让整列参差不齐。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   方法对照表：左列中文方法名 + 英文缩写分行，右列用途描述
 * use:      方法学清单、检测项目清单（技术服务页）
 * notfor:   营销参数 → SpecTable；缩写对照（无描述）→ DefinitionList
 * pairs:    InstrumentReportPanel
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * src:       mce
 * manual:    mce-library
 * evidence: MCE library p8「常用分子水平检测方法」
 * since:    v0.4
 * usage:    <MethodTable rows={[{ cn: '时间分辨荧光', abbr: 'TR-FRET', desc: '结合亲和力检测' }]} />
 */
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

/* ---------------------------------------------------------------
 * C6 键值属性表（KeyValueTable）★产品页左栏属性清单
 * **无列头**的两列纵排：左键（tint 底、加粗）右值。
 * 与 DefinitionList 的分工：DefinitionList 是"术语 → 释义"的连续阅读块（无底色）；
 *   本组件是"属性 → 取值"的**清单**（有底色、可读性优先、用于选型决策）。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   无列头两列纵排的键值表：左键（tint 底加粗）右值
 * use:      产品页左栏的属性→取值清单（选型决策用）
 * notfor:   术语→释义的连续阅读块 → DefinitionList（无底色）
 * pairs:    FigurePanel
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <KeyValueTable items={[{ k: '纯度', v: '≥ 95%' }]} />
 */
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
