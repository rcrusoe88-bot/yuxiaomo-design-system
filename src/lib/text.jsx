// 族 K 文本族 —— 之前整个系统只有 Lead / Sub / Footnotes 三个文本组件，
// 而"文本块"是产品手册占比最大的内容层。本文件把它补成完整一套。
//
// 核心纪律（来自 MCE 实测）：
//   1. 正文 9pt、行高 1.75、色 #414042（本系统对应 NEUTRAL.text）——全册只有一个正文规格，
//      绝不为"凑版面"临时改字号。
//   2. **行内加粗**是 MCE 唯一的高亮手段：靶点名/术语用同字号 + Regular 字重，
//      不加色、不加底、不加下划线。本文件的 RichText 就是这条规则的实现。
//   3. 中英对照用「上中文 9pt + 下英文 7.5pt 浅灰」两行，不并排、不用括号硬塞。
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

const TEXT_SIZE = { sm: '8pt', md: '8.5pt', lg: '9pt' }

/* ---------------------------------------------------------------
 * 行内富文本：把 `**词**` 渲染为同字号加粗（MCE 的"行内强调"）。
 * 单独导出是因为它是**唯一允许的文本高亮手段**，
 * 卡片组件（ProductCardGrid 等）与列表组件都要复用它。
 * 传入非字符串（已是 JSX）时原样返回，便于混排。
 * --------------------------------------------------------------- */
export function renderRich(text) {
  if (typeof text !== 'string') return text
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  if (parts.length === 1) return parts[0]
  return parts.map((p, i) => (
    p.length > 4 && p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 700, color: '#333' }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  ))
}

/* ---------------------------------------------------------------
 * 图注（FigCaption）—— 图下方的小字说明
 * MCE 的位置在**右下角、加粗深灰**（表达"这是结论"而非"这是说明"）；
 * tone="soft" 时改为居中浅灰（纯描述性图注）。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   图注：图下方的小字说明（strong=加粗深灰结论 / soft=浅灰描述）
 * use:      任何图 / 表的下方
 * notfor:   图上方的标题 → FigurePanel 的 title；正文段落 → BodyText
 * pairs:    FigurePanel, FigurePanel 内容
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向（原页图注在右下角加粗深灰）
 * since:    v0.4
 * usage:    <FigCaption tone="strong">图 1  LNP 粒径与 PDI 分布</FigCaption>
 */
export function FigCaption({ children, tone = 'strong', align, style }) {
  const n = useNeutral()
  return (
    <div style={{
      fontSize: '7.5pt',
      fontWeight: tone === 'strong' ? 600 : 400,
      color: tone === 'strong' ? n.text : n.textSoft,
      textAlign: align || (tone === 'strong' ? 'right' : 'center'),
      lineHeight: 1.5, marginTop: '2mm', ...style,
    }}>{children}</div>
  )
}

/* ---------------------------------------------------------------
 * K1 正文段落（BodyText）
 * text 支持 `**加粗**`；也可直接传 children（JSX）。
 * columns>1 → CSS 多栏流式（`breakInside: avoid` 在块级元素上可靠）。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   正文段落（支持 **行内加粗**，可 1–2 栏流式）
 * use:      连续论述的正文
 * notfor:   分点罗列 → BulletList / NumberedList；多栏仅用于无小标题的连续论述
 * pairs:    FigCaption, BarTitle
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <BodyText text="LNP 由四种脂质组分自组装而成，**可电离脂质**决定内体逃逸效率。" columns={2} />
 */
export function BodyText({ text, children, columns = 1, size = 'lg', justify = true, style }) {
  const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.lg
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.78,
      textAlign: justify ? 'justify' : 'left',
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {text != null ? renderRich(text) : children}
    </div>
  )
}

/* ---------------------------------------------------------------
 * K2 圆点列表（BulletList）
 * 圆点用主题色；items 每项支持 `**加粗**`。columns 支持双栏清单。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   圆点列表（主题色圆点），语义 = 并列、无先后
 * use:      并列要点罗列
 * notfor:   有先后顺序 → NumberedList；实验动作序列 → BeadChain
 * pairs:    BarTitle, DefinitionList
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <BulletList items={['**粒径** 80–120 nm', 'PDI ≤ 0.2']} columns={2} />
 */
export function BulletList({ items = [], columns = 1, size = 'md', marker = '•', style }) {
  const t = useTheme(); const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.72,
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '1.8mm', breakInside: 'avoid', marginBottom: '1.1mm' }}>
          <span style={{ color: t.functional, flexShrink: 0, lineHeight: 1.72 }}>{marker}</span>
          <span style={{ flex: 1, minWidth: 0 }}>{renderRich(it)}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------
 * K3 数字列表（NumberedList）
 * 数字用主题色 + 等宽数字，右对齐成列，使"第 10 项"不会把文字推歪。
 * 与 BulletList 的分工：**有先后顺序**用数字，纯并列用圆点。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   数字列表（主题色等宽数字、右对齐成列），语义 = 并列、有先后
 * use:      有先后顺序的条目（第 10 项不会把文字推歪）
 * notfor:   纯并列 → BulletList；需要图形化的步骤流 → NumberedStepFlow
 * pairs:    BarTitle
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <NumberedList items={['质粒构建', '体外转录', 'LNP 包封']} />
 */
export function NumberedList({ items = [], columns = 1, start = 1, size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{
      fontSize: fs, color: n.text, lineHeight: 1.72,
      columnCount: columns > 1 ? columns : undefined,
      columnGap: columns > 1 ? '8mm' : undefined,
      margin: '0 0 4mm', ...style,
    }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: '2mm', breakInside: 'avoid', marginBottom: '1.1mm' }}>
          <span style={{
            flex: '0 0 5mm', textAlign: 'right', color: t.functional, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums', flexShrink: 0,
          }}>{i + start}.</span>
          <span style={{ flex: 1, minWidth: 0 }}>{renderRich(it)}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------
 * K4 术语定义列表（DefinitionList）
 * 左术语（深灰粗）+ 右释义（正文灰），行间 0.4pt 细线。
 * 用途：技术名词解释、缩写对照表、页面右下角的名词栏。
 * 与表格的分工：**没有列头**时用本组件，不需要扛表格语义。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   术语定义列表：左术语（深灰粗）+ 右释义（正文灰），行间细线
 * use:      技术名词解释、缩写对照、页面右下角名词栏
 * notfor:   属性→取值清单（要底色与可读性优先）→ KeyValueTable；不需要表格语义时用本组件
 * pairs:    BarTitle
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <DefinitionList items={[{ term: 'LNP', en: 'Lipid nanoparticle', desc: '脂质纳米颗粒' }]} />
 */
export function DefinitionList({ items = [], termWidth = '30mm', size = 'md', rule = true, style }) {
  const n = useNeutral()
  const fs = TEXT_SIZE[size] || TEXT_SIZE.md
  return (
    <div style={{ margin: '0 0 4mm', ...style }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', gap: '3mm', padding: '1.8mm 0', alignItems: 'flex-start',
          borderBottom: rule && i < items.length - 1 ? `0.4pt solid ${n.line}` : 'none',
        }}>
          <div style={{
            flex: `0 0 ${termWidth}`, fontWeight: 700, color: '#333', fontSize: fs, lineHeight: 1.6,
          }}>{it.term}</div>
          <div style={{ flex: 1, minWidth: 0, color: n.text, fontSize: fs, lineHeight: 1.68 }}>
            {renderRich(it.def)}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------
 * K5 提示带（NoteBand）
 * 左色条 + 浅底 + 说明文字；tone="solid" 时为主题色实底反白（用于关键声明）。
 * 用途：页脚的适用范围、"*注"之上的重要提示、合规声明。
 * 与 Footnotes 的分工：Footnotes 是页脚最末的 `*` 小字；NoteBand 是**版心内**的强调块。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   版心内的提示带：左色条 + 浅底 + 说明文字（solid 为主题色实底反白）
 * use:      「注意 / 用哪个 / 为什么这样做」这类编者提示；合规声明
 * notfor:   页脚最末的 * 小字 → Footnotes（NoteBand 在版心内，Footnotes 在页脚）
 * pairs:    Footnotes, ConclusionBanner
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <NoteBand icon="gear" label="为什么" text="**PEG-脂质**过量会降低细胞摄取。" />
 */
export function NoteBand({ children, text, label, icon, tone = 'tint', style }) {
  const t = useTheme(); const n = useNeutral()
  const solid = tone === 'solid'
  const line = tone === 'line'
  return (
    <div style={{
      display: 'flex', gap: '2.6mm', alignItems: 'flex-start', margin: '4mm 0',
      background: solid ? t.functional : line ? 'transparent' : t.tint,
      color: solid ? '#fff' : n.text,
      borderLeft: line ? `1.6mm solid ${t.functional}` : 'none',
      borderRadius: '1.2mm', padding: '3mm 3.8mm', ...style,
    }}>
      {icon && (
        <Icon name={icon} size={15} primary={solid ? '#FFFFFF' : t.functional}
          secondary={solid ? '#FFFFFF' : t.capsuleLight} style={{ marginTop: '0.4mm', flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0, fontSize: '8.5pt', lineHeight: 1.72 }}>
        {label && <div style={{ fontWeight: 700, marginBottom: '0.9mm' }}>{label}</div>}
        {text != null ? renderRich(text) : children}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
 * K6 中英对照注解（AnnotationPair）
 * 上中文 9pt 深灰 + 下英文 7.5pt 浅灰；divider 打开时左侧加一条浅色竖线。
 * 用途：图旁的注解、服务网络图两侧的说明、双语页的每一条 bullet。
 * --------------------------------------------------------------- */
/* @ds-contract
 * intent:   注解对：上中文 9pt 深灰 + 下英文 7.5pt 浅灰（可加左竖线）
 * use:      图旁的注解、服务网络图两侧的说明、双语页的每一条要点
 * notfor:   通栏连续段落 → BodyText；需要左右分栏对照 → 用两列网格包 BodyText
 * pairs:    ServiceNetworkMap, LegendFigure
 * hue:      中性文本层 · 不引入色相（正文 #414042 / 次级 #808080）
 * evidence: MCE 五册逆向 · v0.4 批
 * since:    v0.4
 * usage:    <AnnotationPair cn="现象：粒径随 N/P 比下降" en="Particle size decreases with N/P ratio" />
 */
export function AnnotationPair({ cn, en, divider = true, size = 'md', align = 'left', style }) {
  const t = useTheme(); const n = useNeutral()
  const cnSize = size === 'sm' ? '8pt' : '9pt'
  const enSize = size === 'sm' ? '6.5pt' : '7.5pt'
  return (
    <div style={{ display: 'flex', gap: '2.4mm', textAlign: align, ...style }}>
      {divider && (
        <div style={{ flex: '0 0 0.9mm', background: t.capsuleLight, borderRadius: '0.5mm' }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: cnSize, color: n.text, fontWeight: 600, lineHeight: 1.55 }}>{cn}</div>
        {en && (
          <div style={{
            fontSize: enSize, color: n.textSoft, fontWeight: 300, lineHeight: 1.45, marginTop: '0.7mm',
          }}>{en}</div>
        )}
      </div>
    </div>
  )
}
