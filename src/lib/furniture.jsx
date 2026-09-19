// 族 O 家具族（v0.4）—— 页眉 / 页脚的"品牌元件"。
//
// 为什么单独成族：结构页（族 A）解决的是"整页深底 + 大标题"，而页眉页脚是
// **每页重复出现**的元件，必须能被 Page 内自由调用，且不引入任何深底。
//
// MCE 实测页眉规格（五册一致，是它"专业感"的主要来源之一）：
//   左：品牌名 9pt 粗 + 副行 tagline 9pt Light（两行，左对齐）
//   右：联系方式 / 网址 / 语种，同为 9pt 以下
//   下线：一条极细的主色浅线，把页眉与正文分开
//
// 纪律：页眉页脚**只允许出现一次色相**（主色）与灰阶；禁止加色块、加图标装饰。
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

/* ---------------------------------------------------------------
 * O1 页眉品牌条（BrandHeaderBar）
 * 放在 `Page` 的第一个子元素。左侧品牌 + 副行，右侧 meta 或自定义 JSX。
 * 与 `Cover` 的区别：Cover 是**封面专用**（满版深底），本组件是所有**内页**的通用页眉。
 * --------------------------------------------------------------- */
export function BrandHeaderBar({ brand, tagline, meta, right, rule = true, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6mm',
      paddingBottom: rule ? '2.6mm' : 0,
      borderBottom: rule ? `0.6pt solid ${t.capsuleLight}` : 'none',
      marginBottom: '6mm', ...style,
    }}>
      <div style={{ minWidth: 0 }}>
        {brand && (
          <div style={{
            fontSize: '10pt', fontWeight: 800, color: t.functional,
            letterSpacing: '0.3px', lineHeight: 1.25,
          }}>{brand}</div>
        )}
        {tagline && (
          <div style={{ fontSize: '7.5pt', fontWeight: 300, color: n.text, marginTop: '0.9mm', lineHeight: 1.4 }}>
            {tagline}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        {meta && (
          <div style={{ fontSize: '7.5pt', color: n.text, lineHeight: 1.55 }}>{meta}</div>
        )}
        {right}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
 * O2 页脚联系带（ContactFooterBand）★内页收口
 * 与 `BackCover` 的分工：BackCover 是**封底的整页联系页**；
 *   本组件是**内页底部**的联系带（例如服务页收口），横排 2–4 项。
 * tone: 'tint' 浅底（默认）| 'line' 仅顶部细线 | 'solid' 主色实底反白（谨慎用，
 *   内页出现实底深色块会破坏 R2，只在这一页就是转化页时才允许）
 * items: [{ type: 'web'|'phone'|'mail'|'addr', text }]
 * --------------------------------------------------------------- */
export function ContactFooterBand({ heading, items = [], tone = 'tint', columns, style }) {
  const t = useTheme(); const n = useNeutral()
  const icons = { web: 'globe', phone: 'phone', mail: 'mail', addr: 'pin' }
  const solid = tone === 'solid'
  const line = tone === 'line'
  const cols = columns || Math.min(Math.max(items.length, 1), 4)
  return (
    <div style={{
      margin: '5mm 0 0',
      background: solid ? t.functional : line ? 'transparent' : t.tint,
      borderTop: line ? `0.75pt solid ${t.functional}` : 'none',
      borderRadius: solid || !line ? '1.2mm' : 0,
      padding: line ? '3.4mm 0 0' : '3.4mm 4mm', ...style,
    }}>
      {heading && (
        <div style={{
          fontSize: '9pt', fontWeight: 700, color: solid ? '#fff' : '#333', marginBottom: '2.4mm',
        }}>{heading}</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '2mm 5mm' }}>
        {items.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.2mm', minWidth: 0 }}>
            <Icon name={icons[c.type] || 'globe'} size={13}
              primary={solid ? '#FFFFFF' : t.functional}
              secondary={solid ? '#FFFFFF' : t.capsuleLight}
              style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '8.5pt', color: solid ? '#fff' : n.text }}>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
