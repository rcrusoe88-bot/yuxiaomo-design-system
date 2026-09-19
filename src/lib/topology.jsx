// 族 M 拓扑图（v0.4）—— 表达「关系与顺序」的图形，是流程族 E/H 的形态扩展。
//
// 为什么单独成族：E/H 只有「链 / 漏斗 / 环 / 公式 / 燕尾」五种拓扑，而一张产品手册里
// 真正需要表达的关系有六类以上。本文件按**语义 → 拓扑**一一绑定（规则 R14「一站一拓扑」）：
//
//   表达"分几步"        → NumberedStepFlow  编号步骤流（有先后、已定序）
//   表达"A 且 B 且 C"   → HexChain          并行条件项（⊕ 连接、无先后）
//   表达"我们是怎么做的" → BeadChain          实验室动作链（带质感、亲和）
//   表达"循环迭代"      → AnnotatedCycle     环形流程（回到起点）
//   表达"上下游依赖"    → ServiceNetworkMap  网络图（多入口多出口）
//   表达"所处阶段"      → PhaseBand          阶段带（时间轴上的位置）
//
// 铁律：同一份手册里，同一种语义永远用同一种拓扑；不同语义绝不共用同一种拓扑。
import { useId } from 'react'
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'
import { pastelRamp, mixWhite } from './color'
import { renderRich, FigCaption } from './text'

// 色带：palette="tone"（默认，同色相多档，守 R1/R22）| "category"（跨色相，须显式声明）
const rampOf = (base, n, palette) => pastelRamp(base, n, { spread: palette === 'category' ? 1 : 0 })

/* ---------------------------------------------------------------
 * M1 编号步骤流（NumberedStepFlow）★流程页主力
 * 复刻自 MCE library p89「DEL 建库和筛选的流程」：
 *   每步 = 大号实心圆（01–06，骑在盒顶）+ 同色描边盒（标题 + 英文副题 + 描述）+ 步间箭头。
 * 与 FlowChain 的分工：
 *   FlowChain = 顶部实色**条**的表头框链（正统、正式）
 *   NumberedStepFlow = 圆形**编号** + 描边盒（更亲和、更适合"实验步骤"）
 *
 * steps: [{ no, title, en, desc, color }]
 * --------------------------------------------------------------- */
export function NumberedStepFlow({ steps = [], palette = 'tone', size = 'md', caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(steps.length, 1), palette)
  const d = size === 'sm' ? 11 : 14
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '2.4mm' }}>
        {steps.map((s, i) => {
          const c = s.color || ramp[i % ramp.length].base
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', flex: 1, minWidth: 0 }}>
              <div style={{
                position: 'relative', flex: 1, minWidth: 0, marginTop: `${d / 2}mm`,
                border: `0.75pt solid ${c}`, borderRadius: '2mm', background: '#fff',
                padding: '5.4mm 3mm 3.4mm', textAlign: 'center',
              }}>
                <div style={{
                  position: 'absolute', top: `-${d / 2}mm`, left: '50%', transform: 'translateX(-50%)',
                  width: `${d}mm`, height: `${d}mm`, borderRadius: '50%', background: c, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: size === 'sm' ? '8.5pt' : '9.5pt',
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.no != null ? s.no : String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontSize: '9pt', fontWeight: 700, color: '#333', lineHeight: 1.35 }}>{s.title}</div>
                {s.en && (
                  <div style={{ fontSize: '7pt', fontWeight: 300, color: n.textSoft, marginTop: '0.8mm', lineHeight: 1.35 }}>{s.en}</div>
                )}
                {s.desc && (
                  <div style={{ fontSize: '7.5pt', color: n.text, lineHeight: 1.58, marginTop: '1.8mm' }}>
                    {renderRich(s.desc)}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  alignSelf: 'center', color: t.capsuleLight, fontWeight: 800, fontSize: '11pt',
                  padding: '0 0.6mm', flexShrink: 0,
                }}>›</div>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * M2 六边形图标链（HexChain）★"套餐包含什么"的清单式表达
 * 复刻自 MCE library p6/p40/p43「产品组成 / 订购须知」：
 *   6 个六边形图标 + 下方的 ⊕ 连接符，每项 = 图标 + 中文标签 + 英文标签。
 * 语义：**并列的条件项**（A + B + C + …），项之间没有先后，缺一不可。
 * 与 IconFlowBar 的分工：IconFlowBar 用 `›`（有方向），HexChain 用 `⊕`（无方向、相加）。
 *
 * palette 默认 'tone'（同色相多档）——依据 R22：来源页 p06/p40 本身即**同色相多档**，
 *   且各六边形是"同一个套餐的组成件"，并非不同类目；跨色相会让读者以为颜色有含义。
 *   确需跨色相时显式传 palette="category"，并注意 R21 类目色恒定。
 *
 * items: [{ icon, label, en, color }]
 * --------------------------------------------------------------- */
export function HexChain({ items = [], connector = '+', palette = 'tone', size = 19, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(items.length, 1), palette)
  const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '1.4mm', flexWrap: 'wrap' }}>
        {items.map((it, i) => {
          const r = ramp[i % ramp.length]
          const c = it.color || r.base
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.4mm' }}>
              <div style={{ textAlign: 'center', width: `${size + 8}mm` }}>
                <div style={{
                  width: `${size}mm`, height: `${size * 1.08}mm`, background: c, clipPath: HEX,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                }}>
                  <Icon name={it.icon || 'check'} size={Math.round(size * 0.78)}
                    primary="#FFFFFF" secondary="rgba(255,255,255,0.7)" />
                </div>
                <div style={{
                  fontSize: '7.5pt', fontWeight: 600, color: '#333', marginTop: '1.6mm', lineHeight: 1.35,
                }}>{it.label}</div>
                {it.en && (
                  <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.35 }}>{it.en}</div>
                )}
              </div>
              {i < items.length - 1 && (
                <div style={{
                  width: '4.6mm', height: '4.6mm', borderRadius: '50%', flexShrink: 0,
                  background: t.capsuleLight, color: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '8pt',
                  marginTop: `${size * 0.4}mm`,
                }}>{connector}</div>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * M3 珠链（BeadChain）★"实验动作"的亲和表达
 * 复刻自 MCE 筛选流程页：浅色粗轨道 + 一串实底圆珠骑在轨道上，标签在珠内。
 * 语义：**线性的实验动作序列**，强调"一步接一步做了几件事"，
 *   而不是"交付阶段"（那是 StagePipelineChain）或"分几步"（那是 NumberedStepFlow）。
 * 为什么要有它：圆珠比箭头框更"手感"，用在面向科研用户的方法学页最合适。
 *
 * steps: [{ label, color }]
 * --------------------------------------------------------------- */
export function BeadChain({ steps = [], size = 15, palette = 'tone', caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(steps.length, 1), palette)
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ position: 'relative', padding: '1mm 0' }}>
        {/* 轨道：与主色同色相、极浅，宽 4.4mm，两端止于首末珠心 */}
        <div style={{
          position: 'absolute', left: `${size / 2}mm`, right: `${size / 2}mm`, top: '50%',
          transform: 'translateY(-50%)', height: '4.4mm',
          background: mixWhite(t.functional, 0.84), borderRadius: '999px',
        }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {steps.map((s, i) => {
            const c = s.color || ramp[i % ramp.length].base
            return (
              <div key={i} style={{
                width: `${size}mm`, height: `${size}mm`, borderRadius: '50%', flexShrink: 0,
                background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontWeight: 600, fontSize: '7.5pt', lineHeight: 1.22,
                padding: '1.2mm', boxSizing: 'border-box',
              }}>{renderRich(s.label)}</div>
            )
          })}
        </div>
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * M4 标注环形流程（AnnotatedCycle）★"闭环"语义
 * N 个节点沿圆周均匀分布 + 顺时针弧形箭头 + 可选中心标签。
 * 与 CycleFlowDiagram 的分工（同族不同语体，务必分清）：
 *   CycleFlowDiagram = **仪表盘式**：≤4 节点、渐变粗环、四角图标，是"结构化"的
 *   AnnotatedCycle  = **插图式**：3–8 节点、细弧箭头、节点为文字胶囊，是"叙述性"的
 * 用途：基因合成→载体构建→表达→纯化→交付 这类闭环服务链。
 *
 * nodes: [{ label, sub }]   center: { label, sub }
 * --------------------------------------------------------------- */
export function AnnotatedCycle({ nodes = [], center, radius = 36, nodeWidth = 32, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const uid = String(useId()).replace(/[^a-zA-Z0-9]/g, '')
  const W = 180, H = 112, cx = W / 2, cy = H / 2 + 1
  const N = Math.max(nodes.length, 1)
  const pt = (i, r) => {
    const a = -Math.PI / 2 + (i / N) * Math.PI * 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a }
  }
  const pad = 0.34 // 弧线两端留白（弧度）
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ position: 'relative', width: '100%', height: `${H}mm` }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker id={`ach-${uid}`} markerWidth="5" markerHeight="5" refX="4.2" refY="2.5" orient="auto">
              <path d="M0 0 L5 2.5 L0 5 Z" fill={t.capsuleLight} />
            </marker>
          </defs>
          {nodes.map((_, i) => {
            if (nodes.length < 2) return null
            const a0 = pt(i, radius).a + pad
            const a1 = pt((i + 1) % N, radius).a - pad + (i === N - 1 ? Math.PI * 2 : 0)
            const p0 = { x: cx + radius * Math.cos(a0), y: cy + radius * Math.sin(a0) }
            const p1 = { x: cx + radius * Math.cos(a1), y: cy + radius * Math.sin(a1) }
            return (
              <path key={i}
                d={`M${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A${radius} ${radius} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`}
                fill="none" stroke={t.capsuleLight} strokeWidth="0.6"
                markerEnd={`url(#ach-${uid})`} />
            )
          })}
          {center && <circle cx={cx} cy={cy} r="17" fill={t.tint} stroke={t.capsuleLight} strokeWidth="0.5" />}
        </svg>

        {/* 节点：HTML 层按同一坐标系百分比定位，与 SVG 严格对齐（容器比例恒为 180:112） */}
        {nodes.map((nd, i) => {
          const p = pt(i, radius)
          return (
            <div key={i} style={{
              position: 'absolute', left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`,
              transform: 'translate(-50%,-50%)', width: `${nodeWidth}mm`, textAlign: 'center',
              background: '#fff', border: `0.75pt solid ${t.capsuleLight}`, borderRadius: '1.2mm',
              padding: '1.8mm 1.6mm',
            }}>
              <div style={{ fontSize: '8pt', fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{nd.label}</div>
              {nd.sub && (
                <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.3, marginTop: '0.5mm' }}>{nd.sub}</div>
              )}
            </div>
          )
        })}
        {center && (
          <div style={{
            position: 'absolute', left: '50%', top: `${(cy / H) * 100}%`, transform: 'translate(-50%,-50%)',
            textAlign: 'center', width: '30mm',
          }}>
            <div style={{ fontSize: '9pt', fontWeight: 700, color: t.functional, lineHeight: 1.25 }}>{center.label}</div>
            {center.sub && <div style={{ fontSize: '6.5pt', color: n.textSoft, marginTop: '0.5mm' }}>{center.sub}</div>}
          </div>
        )}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * M5 服务网络图（ServiceNetworkMap）★"我们能做哪些环节"的总图
 * 复刻自 MCE PROTAC p11 / 药物发现服务册「Building Blocks of Conjugates」：
 *   网格化放置的节点盒（浅底 + 主色字），节点右/下边缘挂箭头表示流向，
 *   纯文字注解块与节点共处同一网格，围着节点描述"这一环我们提供什么服务"。
 * 语义：**上下游依赖**——有多个入口、汇聚到中枢、再分出多个出口。这是链/环都表达不了的。
 *
 * 与 StagePipelineChain 的分工：链是"一条线"，本组件是"一张网"，只在中枢型画面上用。
 * 布局纪律：grid 的列数固定，节点/注解都用 col+row 显式落位，
 *   因此**箭头只需挂在节点边缘**（right / down），不必计算两点连线——这是它稳定的原因。
 *
 * nodes:    [{ col, row, label, en, span, arrow, tone }]   arrow: 'right'|'down'|'both'
 * captions: [{ col, row, span, cn, en, align }]            纯文字注解块（无框）
 * --------------------------------------------------------------- */
export function ServiceNetworkMap({ columns = 3, nodes = [], captions = [], caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const grid = (o) => ({
    gridColumn: `${o.col} / span ${o.span || 1}`,
    gridRow: o.row,
  })
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: '8mm', rowGap: '9mm', alignItems: 'center',
      }}>
        {captions.map((c, i) => (
          <div key={`c${i}`} style={{ ...grid(c), textAlign: c.align || 'center' }}>
            <div style={{ fontSize: '7.5pt', fontWeight: 600, color: n.text, lineHeight: 1.5 }}>{c.cn}</div>
            {c.en && (
              <div style={{ fontSize: '6.5pt', fontWeight: 300, color: n.textSoft, lineHeight: 1.45, marginTop: '0.7mm' }}>{c.en}</div>
            )}
          </div>
        ))}
        {nodes.map((nd, i) => {
          const deep = nd.tone === 'deep'
          return (
            <div key={`n${i}`} style={{
              ...grid(nd), position: 'relative',
              background: deep ? t.functional : t.tint,
              color: deep ? '#fff' : t.functional,
              border: `0.75pt solid ${deep ? t.functional : t.capsuleLight}`,
              borderRadius: '1.2mm', padding: '2.6mm 2.4mm', textAlign: 'center',
            }}>
              <div style={{ fontSize: '8.5pt', fontWeight: 700, lineHeight: 1.35 }}>{nd.label}</div>
              {nd.en && (
                <div style={{
                  fontSize: '6.5pt', fontWeight: 300, lineHeight: 1.4, marginTop: '0.8mm',
                  opacity: deep ? 0.85 : 0.75,
                }}>{nd.en}</div>
              )}
              {(nd.arrow === 'right' || nd.arrow === 'both') && (
                <span style={{
                  position: 'absolute', right: '-5.6mm', top: '50%', transform: 'translateY(-50%)',
                  color: t.functional, fontWeight: 800, fontSize: '11pt', lineHeight: 1,
                }}>›</span>
              )}
              {(nd.arrow === 'down' || nd.arrow === 'both') && (
                <span style={{
                  position: 'absolute', bottom: '-6mm', left: '50%', transform: 'translateX(-50%)',
                  color: t.functional, fontWeight: 800, fontSize: '11pt', lineHeight: 1,
                }}>↓</span>
              )}
            </div>
          )
        })}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

/* ---------------------------------------------------------------
 * M6 阶段带（PhaseBand）★"我们处在药物开发哪一段"
 * 复刻自 MCE library p44 的中带：
 *   一条多段色带（每段一色、白字小标签）+ 上方括注（把若干段归入一个大阶段）
 *   + 下方细横轴 + 末端箭头。
 * 语义：**时间轴上的位置**——不是流程步骤（那是 StepFlow），而是"分段 + 归档"。
 * active 传入下标时其余段降透明度，用于"我们的服务覆盖第 3–5 段"这类强调。
 *
 * stages: string[]                       色带分段
 * phases: [{ label, span }]              上方括注（span 为跨段数，可含 startCol）
 * axis:   string                         轴右侧的终点说明（如"上市"）
 * --------------------------------------------------------------- */
export function PhaseBand({ stages = [], phases = [], active, axis = true, caption, style }) {
  const t = useTheme(); const n = useNeutral()
  const ramp = rampOf(t.functional, Math.max(stages.length, 1), 'tone')
  const activeSet = active == null ? null
    : Array.isArray(active) ? new Set(active) : new Set([active])
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {phases.length > 0 && (
        <div style={{ display: 'flex', marginBottom: '1.4mm', paddingLeft: '0mm' }}>
          {phases.map((p, i) => (
            <div key={i} style={{
              flex: p.span, textAlign: 'center', fontSize: '7.5pt', fontWeight: 600, color: '#333',
              paddingBottom: '1.2mm',
              borderBottom: `0.5pt solid ${n.ghost}`,
              borderLeft: i > 0 ? `0.5pt solid ${n.ghost}` : 'none',
            }}>{p.label}</div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex' }}>
        {stages.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', background: ramp[i % ramp.length].base, color: '#fff',
            fontSize: '7pt', fontWeight: 600, padding: '2.1mm 1mm', lineHeight: 1.3,
            opacity: activeSet && !activeSet.has(i) ? 0.32 : 1,
            borderRight: i < stages.length - 1 ? '0.6mm solid #fff' : 'none',
          }}>{s}</div>
        ))}
      </div>
      {axis && (
        <div style={{ position: 'relative', height: '3mm' }}>
          <svg viewBox="0 0 100 4" preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <line x1="0" y1="1" x2="98.4" y2="1" stroke={t.capsuleDeep} strokeWidth="0.5" />
            <path d="M98.4 0 L100 1 L98.4 2 Z" fill={t.capsuleDeep} />
          </svg>
        </div>
      )}
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
