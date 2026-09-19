// 族 F 案例与证据：案例字段块 / 证据图组 / 品牌色图表
// R7：证明用原图——直角、无框、无阴影、无滤镜；唯一允许干预 = 绿色虚线框圈选
import { useTheme, useNeutral } from './theme'

// ---------- F1 案例字段块（键黑粗、值灰、纯排版无底色） ----------
/* @ds-contract
 * intent:   案例三段式（技术难点 / 解决方案 / 结果），纯排版无底色
 * use:      客户案例页
 * notfor:   客户评价背书 → TestimonialCard
 * pairs:    EvidenceGrid, MetricStrip
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <CaseBlock title="难表达蛋白的 mRNA 优化" facts={[{ k: '技术难点', v: 'GC 含量过高' }]} />
 */
export function CaseBlock({ title, facts }) {
  const n = useNeutral()
  return (
    <div style={{ margin: '4mm 0' }}>
      <div style={{ fontWeight: 700, fontSize: '10pt', color: '#333', marginBottom: '2mm' }}>{title}</div>
      {facts.map((f, i) => (
        <div key={i} style={{ fontSize: '9pt', lineHeight: 1.7, color: n.text, marginBottom: '1.2mm', textAlign: 'justify' }}>
          <b style={{ color: '#333' }}>{f.k}：</b>{f.v}
        </div>
      ))}
    </div>
  )
}

// ---------- F3 证据图组（R7 + 可选绿色虚线圈选框） ----------
// images: [{ src, caption }]  highlight: { imgIndex, x, y, w, h }（百分比）
/* @ds-contract
 * intent:   原始实验图直角平铺（可加绿色虚线圈选）
 * use:      原始数据图作为证据（免疫荧光、电泳等）
 * notfor:   精修示意图 / 通路图 → FigurePanel / LegendFigure
 * pairs:    CaseBlock, FigCaption
 * hue:      GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <EvidenceGrid images={[{ src: '/assets/if_1.png', caption: '图 1  免疫荧光' }]} cols={3} />
 */
export function EvidenceGrid({ images, note, highlight, cols }) {
  const n = useNeutral()
  return (
    <div style={{ margin: '3mm 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || images.length}, 1fr)`, gap: '4mm' }}>
        {images.map((im, i) => (
          <div key={i}>
            {im.caption && <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '8.5pt', color: '#333', marginBottom: '1.5mm' }}>{im.caption}</div>}
            <div style={{ position: 'relative' }}>
              <img src={im.src} alt="" style={{ width: '100%', display: 'block' }} />
              {highlight && highlight.imgIndex === i && (
                <div style={{
                  position: 'absolute',
                  left: `${highlight.x}%`, top: `${highlight.y}%`,
                  width: `${highlight.w}%`, height: `${highlight.h}%`,
                  border: '1.5pt dashed #2FA84F', boxSizing: 'border-box',
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
      {note && <div style={{ textAlign: 'center', color: n.textSoft, fontSize: '8pt', marginTop: '2mm' }}>{note}</div>}
    </div>
  )
}

// ---------- F4 品牌色柱状图（浅档 vs 深档双系列，阳性对照橙点缀） ----------
// groups: [{ label, a, b, control? }]  a=light series, b=deep series, control=true 用橙色
/* @ds-contract
 * intent:   柱状图双系列（浅档 capsuleLight + 深档 functional，control 走橙）
 * use:      两组对比（A/B 或优化前后）
 * notfor:   单序列排行 → TargetBarChart；多面板小倍数 → PanelBarChart
 * pairs:    FunnelStages
 * hue:      GenScript · 双系列（浅档 capsuleLight + 深档 functional），对照橙 #E8963C
 * evidence: GenScript 三册逆向 · R1–R13 期
 * since:    v0.1
 * usage:    <DataChart groups={[{ label: 'L1', a: 62, b: 88 }]} seriesNames={['未优化', '优化后']} unit="%" />
 */
export function DataChart({ title, groups, max = 100, unit = '%', seriesNames = ['组 A', '组 B'] }) {
  const t = useTheme(); const n = useNeutral()
  const W = 720, H = 230, padL = 44, padB = 34, padT = 14
  const plotW = W - padL - 16, plotH = H - padT - padB
  const barW = Math.min(14, (plotW / groups.length - 10) / 2)
  const y = (v) => padT + plotH - (v / max) * plotH
  return (
    <div style={{ margin: '3mm 0' }}>
      {title && <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '9pt', color: '#333', marginBottom: '1.5mm' }}>{title}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={padL} y1={y(max * f)} x2={W - 16} y2={y(max * f)} stroke="#E5E5E5" strokeWidth="1" />
            <text x={padL - 6} y={y(max * f) + 3.5} fontSize="9" fill={n.textSoft} textAnchor="end">{max * f}{unit}</text>
          </g>
        ))}
        {groups.map((g, i) => {
          const cx = padL + (plotW / groups.length) * (i + 0.5)
          const hasB = g.b != null
          return (
            <g key={i}>
              <rect x={cx - (hasB ? barW + 1 : barW / 2)} y={y(g.a)} width={barW} height={plotH + padT - y(g.a)}
                fill={g.control ? n.control : t.capsuleLight} />
              {hasB && (
                <rect x={cx + 1} y={y(g.b)} width={barW} height={plotH + padT - y(g.b)}
                  fill={t.functional} />
              )}
              <text x={cx} y={H - padB + 13} fontSize="8.5" fill={n.text} textAnchor="middle">{g.label}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6mm', fontSize: '7.5pt', color: n.textSoft, marginTop: '1mm' }}>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: t.capsuleLight, marginRight: 4 }} />{seriesNames[0]}</span>
        <span><i style={{ display: 'inline-block', width: 10, height: 10, background: t.functional, marginRight: 4 }} />{seriesNames[1]}</span>
      </div>
    </div>
  )
}
