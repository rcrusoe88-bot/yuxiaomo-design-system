// 流程与图解组件族 —— 源自 MCE 五册逆向（GenScript 之外的第二套参考语料）
// 核心规则「一站一拓扑」：线性链=研发管线 / 漏斗=量化收敛 / 环形=迭代 / 公式=组合能力。
// 绝不把同一种流程图复用在不同语义的页面上。
import { useId } from 'react'
import { useTheme, useNeutral } from './theme'
import { Icon } from './icons'

// 图注：一律置于图下方、次级灰（全库统一规则）
function FigCaption({ children, align = 'center' }) {
  const n = useNeutral()
  return (
    <div style={{ color: n.textSoft, fontSize: '7pt', marginTop: '2mm', textAlign: align }}>{children}</div>
  )
}

// ---------- P1 阶段管线链：横向圆形节点 + › 箭头（可选底部长条承载"服务边界"） ----------
// 用途：能力总览页的"总图"。每个节点名应与后续每页的 L2 标题一一对应，形成总-分锚定。
/* @ds-contract
 * intent:   阶段管线链：横向圆形节点 + › 箭头，可选底部 spectrum 服务边界条（总图首选）
 * use:      全册总流程页；「总-分锚定」的锚
 * notfor:   多入口汇聚的网络 → ServiceNetworkMap；实验动作 → BeadChain
 * pairs:    PhaseBand, FlowChain
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <StagePipelineChain stages={['设计', '合成', '包封', '放行']} spectrum={['CRO', 'CDMO']} />
 */
export function StagePipelineChain({ stages = [], spectrum, caption, nodeSize = 18, style }) {
  const t = useTheme()
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {stages.map((s, i) => {
          const label = typeof s === 'string' ? s : s.label
          const active = typeof s === 'object' && !!s.active
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: `${nodeSize}mm`, height: `${nodeSize}mm`, borderRadius: '50%',
                boxSizing: 'border-box', flex: `0 0 ${nodeSize}mm`,
                background: active ? t.functional : t.tint,
                border: `0.6pt solid ${active ? t.functional : t.capsuleLight}`,
                color: active ? '#FFFFFF' : t.header,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontSize: '5.8pt', lineHeight: 1.3, fontWeight: 600, padding: '1.2mm',
              }}>{label}</div>
              {i < stages.length - 1 && (
                <span style={{
                  color: t.capsuleLight, fontSize: '11pt', fontWeight: 700,
                  margin: '0 0.8mm', lineHeight: 1,
                }}>›</span>
              )}
            </div>
          )
        })}
      </div>

      {spectrum && (
        <div style={{ position: 'relative', marginTop: '3.5mm' }}>
          <div style={{
            height: '10mm', borderRadius: '1mm', boxSizing: 'border-box',
            border: `0.5pt solid ${t.capsuleLight}`,
            background: `repeating-linear-gradient(115deg, ${t.tint} 0 3.2mm, ${t.zebra} 3.2mm 6.4mm)`,
          }} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '5mm',
          }}>
            {spectrum.map((s, i) => (
              <span key={i} style={{
                background: i === spectrum.length - 1 ? t.capsuleLight : t.functional,
                color: '#FFFFFF', fontSize: '8pt', fontWeight: 700, lineHeight: 1,
                padding: '1.6mm 5mm', borderRadius: '999px',
              }}>{typeof s === 'string' ? s : s.label}</span>
            ))}
          </div>
        </div>
      )}
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

// ---------- P2 漏斗（量化收敛）：逐层收窄 + 左引线方法名 + 右量化数字 ----------
// 用途：表达"从海量到精筛"的收敛过程。右侧数字即承诺，必须有真实依据，禁止编造。
/* @ds-contract
 * intent:   量化收敛漏斗：逐层收窄横条 + 左侧虚线引线方法名 + 右侧量化数字
 * use:      筛选 / 收敛过程并带量化
 * notfor:   等量并列的多步 → NumberedStepFlow
 * pairs:    DataChart, TargetBarChart
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <FunnelStages stages={[{ method: 'DEL', label: '初筛', value: '10⁹' }]} />
 */
export function FunnelStages({ stages = [], caption, minWidth = 42, style }) {
  const t = useTheme(); const n = useNeutral()
  const total = stages.length
  return (
    <div style={{ margin: '5mm 0', ...style }}>
      {stages.map((s, i) => {
        const w = total > 1 ? 100 - (i * (100 - minWidth)) / (total - 1) : 100
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '1.8mm' }}>
            <div style={{
              width: '40mm', flex: '0 0 40mm', paddingRight: '2.5mm',
              textAlign: 'right', fontSize: '7pt', color: n.textSoft, lineHeight: 1.3,
            }}>
              {s.method}
              <div style={{ borderTop: `0.5pt dashed ${n.line}`, marginTop: '1mm' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <div style={{
                width: `${w}%`, height: '10mm', boxSizing: 'border-box',
                background: s.highlight ? t.capsuleLight : t.functional,
                borderRadius: '1mm', display: 'flex', alignItems: 'center',
                paddingLeft: '4mm', paddingRight: '2mm',
                color: '#FFFFFF', fontSize: '8.5pt', fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{s.label}</div>
              {s.value && (
                <div style={{
                  marginLeft: '3mm', fontSize: '9.5pt', fontWeight: 700,
                  color: t.functional, whiteSpace: 'nowrap',
                }}>{s.value}</div>
              )}
            </div>
          </div>
        )
      })}
      {caption && <FigCaption align="right">{caption}</FigCaption>}
    </div>
  )
}

// ---------- P3 环形迭代图：渐变环 + 四角节点（DMTA / PDCA 类"循环而非流水线"） ----------
// 用途：强调迭代/闭环。与 P1 线性链形成语义对照——流程用链，优化用环。
/* @ds-contract
 * intent:   环形迭代图：≤4 节点、渐变粗环、四角图标（仪表盘式，结构化）
 * use:      闭环迭代、回到起点
 * notfor:   3–8 节点的叙述式闭环 → AnnotatedCycle（本组件最多 4 个节点）
 * pairs:    ComboEquationDiagram
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <CycleFlowDiagram nodes={[{ label: '设计', icon: 'gear' }]} center={{ label: '迭代优化' }} />
 */
export function CycleFlowDiagram({ nodes = [], center, caption, size = 52, strokeWidth = 1.9, style }) {
  const t = useTheme()
  const gid = 'bdsCycle' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const pos = [{ col: 1, row: 1 }, { col: 3, row: 1 }, { col: 3, row: 3 }, { col: 1, row: 3 }]

  const Cell = ({ nd, idx }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '2mm',
      flexDirection: idx === 1 || idx === 2 ? 'row-reverse' : 'row',
    }}>
      <span style={{
        width: '8mm', height: '8mm', borderRadius: '50%', flex: '0 0 8mm',
        background: t.tint, border: `0.6pt solid ${t.capsuleLight}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={nd.icon || 'gear'} size={13} primary={t.header} secondary={t.capsuleLight} />
      </span>
      <span style={{ fontSize: '7.5pt', fontWeight: 600, color: t.header, whiteSpace: 'nowrap' }}>{nd.label}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5mm 0', ...style }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gridTemplateRows: 'auto auto auto',
        alignItems: 'center', justifyItems: 'center', columnGap: '3mm', rowGap: '1mm',
      }}>
        {nodes[0] && <div style={{ gridColumn: 1, gridRow: 1 }}><Cell nd={nodes[0]} idx={0} /></div>}
        {nodes[1] && <div style={{ gridColumn: 3, gridRow: 1 }}><Cell nd={nodes[1]} idx={1} /></div>}

        <div style={{
          gridColumn: 2, gridRow: 1, gridRowEnd: 4, position: 'relative',
          width: `${size}mm`, height: `${size}mm`,
        }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={t.ramp[0]} />
                <stop offset="38%" stopColor={t.ramp[1]} />
                <stop offset="72%" stopColor={t.ramp[2]} />
                <stop offset="100%" stopColor={t.ramp[3]} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="36" fill="none" stroke={`url(#${gid})`} strokeWidth={strokeWidth}
              strokeLinecap="round" strokeDasharray="200 26" transform="rotate(-102 50 50)" />
          </svg>
          <div style={{
            position: 'absolute', inset: '28%', borderRadius: '50%', background: t.tint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '7.5pt', fontWeight: 700, color: t.header, textAlign: 'center', lineHeight: 1.3,
          }}>{center}</div>
        </div>

        {nodes[3] && <div style={{ gridColumn: 1, gridRow: 3 }}><Cell nd={nodes[3]} idx={3} /></div>}
        {nodes[2] && <div style={{ gridColumn: 3, gridRow: 3 }}><Cell nd={nodes[2]} idx={2} /></div>}
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}

// ---------- P4 组合公式图：A ＋ B » 产物（用"公式感"表达组合/偶联能力） ----------
// 用途：平台类能力页——如"载体 ＋ 载荷 » 偶联产物"，或"原料 ＋ 工艺 » 成品"。
/* @ds-contract
 * intent:   组合公式图「A ＋ B » 产物」三栏式（每栏 = 胶囊标题 + 药丸清单）
 * use:      由若干要素组合成产物（A＋B»C）
 * notfor:   并列条件（A 且 B 且 C，无产物）→ HexChain
 * pairs:    CycleFlowDiagram
 * hue:      MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）
 * src:       mce
 * evidence: MCE 五册逆向 · v0.3 批
 * since:    v0.3
 * usage:    <ComboEquationDiagram left={{ title: '脂质组分', items: ['可电离脂质'] }} right={{ title: 'mRNA', items: ['IVT 产物'] }} result={{ title: 'mRNA-LNP', items: ['成品'] }} />
 */
export function ComboEquationDiagram({ left, right, result, caption, style }) {
  const t = useTheme(); const n = useNeutral()

  const Column = ({ col, tone }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        background: tone || t.header, color: '#FFFFFF', fontSize: '7.5pt', fontWeight: 700,
        lineHeight: 1.2, padding: '1.6mm 2mm', borderRadius: '999px', textAlign: 'center',
      }}>{col.title}</div>
      <div style={{ marginTop: '2mm', display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {(col.items || []).map((it, i) => (
          <div key={i} style={{
            background: t.tint, color: n.text, fontSize: '6.8pt', lineHeight: 1.2,
            padding: '1.1mm 2.5mm', borderRadius: '999px',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{it}</div>
        ))}
      </div>
    </div>
  )

  const Op = ({ sym }) => (
    <div style={{
      flex: '0 0 8mm', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '13pt', fontWeight: 700, color: t.capsuleLight,
    }}>{sym}</div>
  )

  return (
    <div style={{ margin: '5mm 0', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <Column col={left} tone={t.header} />
        <Op sym="＋" />
        <Column col={right} tone={t.capsuleLight} />
        <Op sym="»" />
        <Column col={result} tone={t.functional} />
      </div>
      {caption && <FigCaption>{caption}</FigCaption>}
    </div>
  )
}
