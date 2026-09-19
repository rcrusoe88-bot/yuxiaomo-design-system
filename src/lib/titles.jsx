// 族 B 标题族 · 形态变体 —— 源自 MCE 五册逆向（中文主标 20pt Medium / 英文副题 13pt Light 左对齐）
//
// 为什么单独立一个文件：原族 B 只有「胶囊」与「无底居中」两种形态，而标题是整本手册
// 出现频率最高的元素——它必须有**形态谱系**，否则每一页的标题都是同一个样子。
//
// 完整标题谱系（按"底色从有到无"排列）：
//   PillTitle    胶囊实底，居中  ← primitives.jsx（一页只允许一个）
//   BlockTitle   方块实底，左对齐
//   OutlineTitle 方块描边，空心
//   BarTitle     无底，左侧色条
//   RuleTitle    无底，上方细线
//   PairTitle    无底，中英双行（MCE 主力形态）
//   NumberedTitle 无底，前置编号
//   H2           无底，居中       ← primitives.jsx
//   EyebrowTitle 眉标（标题之上的小字，可独立使用）
//
// 铁律：一页只允许一个 H1 级标题（PillTitle / BlockTitle / OutlineTitle / PairTitle /
//       NumberedTitle 五者择一）；BarTitle / RuleTitle 是 H2 级小节标题，可多次出现。
//
// 关于英文副题：远泰手册已明确"主标题下不加英文副标题"，因此本文件所有 `en` 参数
//   **默认不传即不渲染**；只有做中英双语页（如 MCE 式对外手册）时才显式传入。
import { useTheme, useNeutral } from './theme'

// H1 级中文主标字号阶梯（pt）。MCE 实测 20pt ↔ 180mm 页宽，A4 210mm 页宽取同值即可。
const CN_SIZE = { sm: '14pt', md: '17pt', lg: '20pt' }
const EN_SIZE = { sm: '9.5pt', md: '11pt', lg: '13pt' }

// H2 级小节字号阶梯
const SUB_SIZE = { 1: '13pt', 2: '11pt', 3: '9.5pt' }

/* ---------------------------------------------------------------
 * B3 眉标（Eyebrow）—— 标题之上的小字，用于"编号 / 分类 / 目录号"
 * 例：`Cat. No.: HY-L032`、`01 / 服务流程`
 * MCE 实测用橙色 10pt；但本系统 R1「一册一色相」限制第二色相，
 * 故默认 tone="primary"（主色），仅当该页已有图表橙时才用 tone="accent"。
 * --------------------------------------------------------------- */
export function EyebrowTitle({ items = [], align = 'left', divider = '·', tone = 'primary', style }) {
  const t = useTheme(); const n = useNeutral()
  const color = tone === 'accent' ? n.control : tone === 'muted' ? n.textSoft : t.functional
  const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.6mm', justifyContent: justify,
      fontSize: '9.5pt', color, lineHeight: 1.3, ...style,
    }}>
      {items.map((s, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.6mm' }}>
          {i > 0 && <span style={{ opacity: 0.45 }}>{divider}</span>}
          <span style={{ fontWeight: i === 0 ? 600 : 400 }}>{s}</span>
        </span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------
 * B4 中英对照标题（PairTitle）—— MCE 五册的**主力标题形态**
 * 中文主标主题色 + 英文副题浅灰，左对齐、无底、无装饰线。
 * 实测：library p3/p6/p7/p45/p89 与 qms 全线使用，页眉下方第一个元素。
 * 为什么有效：中文负责"意义"，英文负责"检索与正式感"；两行字号差 1.5 倍即可分层，
 *   不需要任何色块——这也是它比胶囊标题更"高级"的原因。
 * --------------------------------------------------------------- */
export function PairTitle({ cn, en, eyebrow, align = 'left', size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  return (
    <div style={{ textAlign: align, margin: '0 0 5mm', ...style }}>
      {eyebrow && <EyebrowTitle items={eyebrow} align={align} style={{ marginBottom: '1.8mm' }} />}
      <div style={{
        fontSize: c, fontWeight: 600, color: t.functional, lineHeight: 1.26, letterSpacing: '0.2px',
      }}>{cn}</div>
      {en && (
        <div style={{
          fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm', lineHeight: 1.35,
        }}>{en}</div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------
 * B5 方块实底标题（BlockTitle）—— 「方块型」标题
 * 与 PillTitle 的唯一区别是**形态**：全圆 stadium → 直角方块（1.2mm 仅柔化边角）。
 * 什么时候用方块不用胶囊？
 *   胶囊 = 收口、结论、单点 CTA（视觉上是"句号"）
 *   方块 = 分栏、并列、可重复的段落标题（视觉上是"逗号"）
 *   因此方块标题允许一页出现 2 个（分左右栏），胶囊只允许 1 个。
 * --------------------------------------------------------------- */
export function BlockTitle({ children, en, tone = 'solid', size = 'md', width, inline = false, style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  const solid = tone === 'solid'
  const tinted = tone === 'tint'
  return (
    <div style={{ margin: '0 0 5mm', ...style }}>
      <div style={{
        display: inline ? 'inline-block' : 'block', width,
        background: solid ? t.functional : tinted ? t.tint : 'transparent',
        color: solid ? '#fff' : t.functional,
        border: tinted || solid ? 'none' : `0.75pt solid ${t.functional}`,
        fontSize: c, fontWeight: 700, lineHeight: 1.3,
        padding: '2.4mm 6mm', borderRadius: '1.2mm',
      }}>{children}</div>
      {en && (
        <div style={{
          fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm', lineHeight: 1.35,
        }}>{en}</div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------
 * B6 描边空心标题（OutlineTitle）—— 「方块型」的轻量版
 * 主题色 0.75pt 描边 + 主题色字 + 透明底。
 * 用途：与 BlockTitle 同页并置形成"一个强调、一个次要"的对照；
 *   或用于不想让色块压住底纹的场合。
 * --------------------------------------------------------------- */
export function OutlineTitle({ children, en, size = 'md', align = 'left', width, inline = false, style }) {
  const t = useTheme(); const n = useNeutral()
  const c = CN_SIZE[size] || CN_SIZE.md
  const e = EN_SIZE[size] || EN_SIZE.md
  return (
    <div style={{ margin: '0 0 5mm', textAlign: align, ...style }}>
      <div style={{
        display: inline ? 'inline-block' : 'block', width,
        border: `0.75pt solid ${t.functional}`, color: t.functional, background: 'transparent',
        fontSize: c, fontWeight: 700, lineHeight: 1.3,
        padding: '2.2mm 6mm', borderRadius: '1.2mm', textAlign: 'center',
      }}>{children}</div>
      {en && <div style={{ fontSize: e, fontWeight: 300, color: n.text, marginTop: '1.8mm' }}>{en}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * B7 左色条标题（BarTitle）—— H2 级小节标题的主力
 * 左侧 1.6mm 主题色竖条 + 深灰粗字（条高随文字自动伸展）。
 * 复刻自 MCE 实测页内节标题（12pt 青色小标题，见 library p8），
 * 但把青色换成主题主色以守住 R1。
 * level 1/2/3 → 13pt / 11pt / 9.5pt，对应三层小节。
 * --------------------------------------------------------------- */
export function BarTitle({ children, sub, en, level = 2, style }) {
  const t = useTheme(); const n = useNeutral()
  return (
    <div style={{ display: 'flex', gap: '2.6mm', alignItems: 'stretch', margin: '5mm 0 3mm', ...style }}>
      <div style={{ flex: '0 0 1.6mm', background: t.functional, borderRadius: '0.8mm' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.4mm', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: SUB_SIZE[level] || SUB_SIZE[2], fontWeight: 700, color: '#333', lineHeight: 1.35,
          }}>{children}</span>
          {en && <span style={{ fontSize: '7.5pt', fontWeight: 300, color: n.textSoft }}>{en}</span>}
        </div>
        {sub && (
          <div style={{ fontSize: '8.5pt', color: n.text, marginTop: '1.2mm', lineHeight: 1.6 }}>{sub}</div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
 * B8 细线夹标题（RuleTitle）—— 章节内的"分组隔断"
 * 上方一段主题色短线（宽度可调）+ 深灰粗字；不占满通栏，因此比 BarTitle 更轻。
 * 用途：把一页内的内容切成 2~3 组时的组标题；或页中嵌小节的起始标记。
 * --------------------------------------------------------------- */
export function RuleTitle({ children, en, note, align = 'left', ruleWidth = '14mm', style }) {
  const t = useTheme(); const n = useNeutral()
  const centered = align === 'center'
  return (
    <div style={{ margin: '5mm 0 3mm', textAlign: align, ...style }}>
      <div style={{
        width: ruleWidth, height: '0.9mm', background: t.functional, borderRadius: '0.5mm',
        margin: centered ? '0 auto 2.2mm' : '0 0 2.2mm',
      }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2.6mm', justifyContent: centered ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11pt', fontWeight: 700, color: '#333', lineHeight: 1.35 }}>{children}</span>
        {en && <span style={{ fontSize: '7.5pt', fontWeight: 300, color: n.textSoft }}>{en}</span>}
        {note && <span style={{ fontSize: '7.5pt', color: n.textSoft }}>{note}</span>}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
 * B9 编号标题（NumberedTitle）—— 前置大号编号的章节标题
 * `01 / 服务总览` 这类。编号用主题色大写字（20pt）+ 细竖线分隔 + 深灰标题。
 * 与 BarTitle 的分工：BarTitle 是"色条 + 字"，NumberedTitle 是"编号 + 字"，
 *   当内容天然有序（章节、流程步骤、套餐档位）时用编号，否则用色条。
 * `total` 传入后渲染为 `01 / 06` 形式，让读者知道还有多少。
 * --------------------------------------------------------------- */
export function NumberedTitle({ index, total, children, en, size = 'md', style }) {
  const t = useTheme(); const n = useNeutral()
  const num = String(index).padStart(2, '0')
  const c = CN_SIZE[size] || CN_SIZE.md
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3.4mm', margin: '0 0 5mm', ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexShrink: 0 }}>
        <span style={{
          fontSize: '21pt', fontWeight: 700, color: t.functional, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px',
        }}>{num}</span>
        {total != null && (
          <span style={{ fontSize: '8.5pt', color: n.textSoft, marginLeft: '0.6mm' }}>/{String(total).padStart(2, '0')}</span>
        )}
      </div>
      <div style={{ flex: '0 0 0.5pt', alignSelf: 'stretch', background: n.line, minHeight: '7mm' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: c, fontWeight: 700, color: '#333', lineHeight: 1.28 }}>{children}</div>
        {en && <div style={{ fontSize: '8.5pt', fontWeight: 300, color: n.textSoft, marginTop: '1.2mm' }}>{en}</div>}
      </div>
    </div>
  )
}
