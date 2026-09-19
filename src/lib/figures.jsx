// 族 N 图解族（v0.4）—— 装"带插图 / 带图例"的复合图。
//
// 为什么需要单独一族：拓扑族（M）与数据族（I）产出的都是**纯几何**图形；
// 而手册里还有一类图是「插图 + 图例 + 注解」的复合体（如靶点示意图、细胞通路图）。
// 这类图的绘制主体是外部素材（.svg / .png），组件要解决的是**装框、配色块、排图例**，
// 而不是去"画"生物结构——那正是参考手册里专业插画师的活。
//
// 素材纪律：图例色必须与图内标注色一致；插图缺失时**留占位框并写明"待补"**，
//   绝不用 AI 生成的伪科学插图顶上（那属于杜撰）。
import { useTheme, useNeutral } from './theme'
import { FigCaption } from './text'
import { mixWhite } from './color'

/* ---------------------------------------------------------------
 * N1 图面板（FigurePanel）—— 所有图的统一外壳
 * 复刻自 MCE 各册插图区的处理方式：**同色相极浅底 + 0.5pt 细描边 + 内边距**，
 * 图注在框外右侧。
 * 为什么要有统一外壳：一页里放 2–3 张图时，如果每张图各自带不同底色/描边/留白，
 *   页面立刻就散了。外壳把"图形语言"统一收口。
 *
 * tone: 'tint' 同色相极浅底（默认）| 'plain' 白底 + 描边 | 'none' 无底无边（纯留白）
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   图解统一外壳：标题 + 内容区 + 图注（同色相极浅底 + 0.5pt 细描边）
 * use:      一页放 2–3 张图时统一图形语言；插画 / 示意图的框
 * notfor:   原始数据图 → EvidenceGrid（EvidenceGrid 是直角平铺无框）
 * pairs:    FigCaption
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 各册插图区处理方式 · v0.4 批
 * since:    v0.4
 * usage:    <FigurePanel title="LNP 结构" caption="图 3  四组分自组装">{插图}</FigurePanel>
 */
export function FigurePanel({ title, caption, children, tone = 'tint', pad = '4mm', style }) {
  const t = useTheme()
  const bg = tone === 'tint' ? mixWhite(t.functional, 0.94) : '#fff'
  const border = tone === 'none' ? 'none' : `0.5pt solid ${t.capsuleLight}`
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {title && (
        <div style={{ fontSize: '9pt', fontWeight: 600, color: '#333', marginBottom: '2.2mm', lineHeight: 1.35 }}>
          {title}
        </div>
      )}
      <div style={{ background: bg, border, borderRadius: '1.2mm', padding: pad }}>{children}</div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * N2 图例插图（LegendFigure）★靶点图 / 通路图 / 解剖图
 * 复刻自 MCE library p20/p57「肿瘤免疫化合物库靶点举例」：
 *   中央一幅插图（细胞/通路），左右各一列**色块 + 名称**的图例，图内标注与图例同色。
 * 三栏网格（1fr / auto / 1fr）保证左右图例长度不等时插图仍居中。
 *
 * items: [{ label, color, side }]   side 省略时按奇偶自动分左右
 * children / image：插图。两者都不给时渲染**占位框**并提示"待补插图"。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   三栏图例插图：1fr / auto / 1fr 网格，左右各列图例项，中间放图
 * use:      靶点图 / 通路图 / 解剖图（图内标注与图例同色）
 * notfor:   无图例的纯插图 → FigurePanel；缺图时渲染「待补插图」占位而非伪科学图
 * pairs:    FigCaption, AnnotationPair
 * hue:      MCE 化合物库手册 深蓝 #2C6BAA
 * src:       mce
 * manual:    mce-library
 * evidence: MCE library p20 / p57「肿瘤免疫化合物库靶点举例」
 * since:    v0.4
 * usage:    <LegendFigure title="肿瘤免疫靶点" items={[{ label: 'PD-L1', side: 'left' }]} />
 */
export function LegendFigure({
  title, children, image, alt, items = [], artWidth = '58mm', artHeight = '42mm',
  palette = 'category', baseColor, caption, style,
}) {
  const t = useTheme(); const n = useNeutral()
  const auto = (i) => (i % 2 === 0 ? 'left' : 'right')
  const left = items.map((it, i) => ({ it, i })).filter(({ it, i }) => (it.side || auto(i)) === 'left')
  const right = items.map((it, i) => ({ it, i })).filter(({ it, i }) => (it.side || auto(i)) === 'right')
  const fallback = (idx) => (idx % 2 === 0 ? t.functional : t.capsuleLight)

  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {title && (
        <div style={{ fontSize: '9pt', fontWeight: 600, color: '#333', marginBottom: '2.4mm', lineHeight: 1.35 }}>
          {title}
        </div>
      )}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '5mm', alignItems: 'center',
      }}>
        <LegendStack items={left} fallback={fallback} align="right" />
        <div style={{
          width: artWidth, height: artHeight, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
        }}>
          {children || (image
            ? <img src={image} alt={alt || ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            : (
              <div style={{
                width: '100%', height: '100%', border: `0.5pt dashed ${n.ghost}`, borderRadius: '1.2mm',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7pt', color: n.textSoft, textAlign: 'center', lineHeight: 1.6,
              }}>待补插图<br /><span style={{ fontSize: '6pt' }}>（勿用生成图顶替）</span></div>
            ))}
        </div>
        <LegendStack items={right} fallback={fallback} align="left" />
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

function LegendStack({ items, fallback, align, colorOf }) {
  const n = useNeutral()
  const right = align === 'right'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.4mm' }}>
      {items.map(({ it, i }) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '2mm',
          justifyContent: right ? 'flex-end' : 'flex-start',
        }}>
          {!right && <span style={{ width: '3mm', height: '3mm', background: it.color || fallback(i), flexShrink: 0 }} />}
          <span style={{ fontSize: '8.5pt', color: '#333', lineHeight: 1.35 }}>
            {it.label}
            {it.en && <span style={{ fontSize: '6.5pt', color: n.textSoft, marginLeft: '1.6mm', fontWeight: 300 }}>{it.en}</span>}
          </span>
          {right && <span style={{ width: '3mm', height: '3mm', background: it.color || fallback(i), flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------
 * N3 色块图例（SwatchLegend）—— 可独立使用的图例条
 * 用途：散点图 / 聚类图的图注行、页脚的能力色标、多产品配色对照。
 * direction="row" 横排（默认，右对齐）| "column" 纵排
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   色卡图例：色块 + 标签 + 英文的图例网格（可横排可纵排）
 * use:      散点图 / 聚类图的图注行、能力色标、多产品配色对照
 * notfor:   类目胶囊标签 → CategoryTagRow
 * pairs:    ScatterClusterPanel
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <SwatchLegend items={[{ color: '#7EC0EE', label: '质粒服务' }]} />
 */
export function SwatchLegend({ items = [], direction = 'row', align = 'flex-end', label = null, style }) {
  const n = useNeutral()
  const row = direction === 'row'
  return (
    <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: row ? 'wrap' : 'nowrap', gap: row ? '2mm 6mm' : '2mm', justifyContent: row ? align : 'flex-start', alignItems: 'center', margin: '3mm 0', ...style }}>
      {label && (
        <span style={{ fontSize: '7.5pt', fontWeight: 600, color: n.text, marginRight: '2mm' }}>{label}</span>
      )}
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.6mm', fontSize: '7pt', color: n.text, whiteSpace: 'nowrap' }}>
          <span style={{
            width: '2.6mm', height: '2.6mm', background: it.color, borderRadius: it.round ? '50%' : '0.3mm', flexShrink: 0,
          }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}
