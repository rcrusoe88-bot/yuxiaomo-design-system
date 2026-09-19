// 组件提示词实验室 · Prompt Lab（工具页，不是手册页）
//
// 参照 reactbits.dev 的「Copy for AI」四件套，但数据来自**源码生成的 registry.json**：
//   复制提示词 / 复制配置代码 / 复制源码 / 复制 import
//
// 为什么不是手写一份清单：手写的第二份描述一定会与代码脱钩。本页所有内容都来自
// src/lib/*.jsx 的 /* @ds-contract */ 投影（scripts/registry.mjs 生成），
// 一致性由 `npm run audit` 反查 —— 所以这里显示的属性名不可能与代码不符。
//
// 访问：npm run dev 后打开 /?app=registry
import { useMemo, useState } from 'react'
import registry from '../../registry.json'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const HEX_ALL = /#[0-9A-Fa-f]{6}/g

/* 取「来源配色」里的**全部** hex（不是第一个）。
   为什么强调"全部"：本库 71 个组件里有 40 个的 hue 形如
     「GenScript 三册 · 随主题（蓝 #019EDB / 红 #EE3451 / 紫 #682E79）」
   —— 它天然属于**多个**色相。只取第一个会把它们全部显示成蓝色，
   正好就是 R23「配色随来源，不随默认」明令禁止的事。
   取不到 hex = 该组件不引入色相（配色随调用页主题）→ 返回空数组，
   由调用方画一个"非颜色"占位块，**不要退化成灰色**（灰会被读成"来源色是灰"）。*/
function hexesOf(hue) {
  return (hue || '').match(HEX_ALL) || []
}

/* 把 hue 描述里的色值摘掉，只留下"人话"部分，例如
   「MCE 五册 · 随册主题（library #2C6BAA / PROTAC #5A3A7D / qms #F16366 …）」
     → 「MCE 五册 · 随册主题」
   仅用于展示：色块已经负责"色值"，这段文字负责"出处"。 */
function hueLabel(hue) {
  let s = String(hue || '')
  // ① 「标识符 + hex」成对摘除（可带分隔符），如 `library #2C6BAA / `
  s = s.replace(/([A-Za-z0-9_\-\u4e00-\u9fa5]+\s*)?#[0-9A-Fa-f]{6}\s*[/·、,，]?/g, '')
  s = s.replace(/[/·、,，]\s*[/·、,，]/g, '·')
  // ② 清掉摘空后残留的括号（含只剩省略号的）
  s = s.replace(/[（(]\s*[·…\s]*[)）]/g, '')
  s = s.replace(/…/g, '')
  // ③ 收尾：游离分隔符、悬空左括号、多余空白
  s = s.replace(/\s*[·/、,，]\s*$/g, '')
  s = s.replace(/^\s*[·/、,，]\s*/g, '')
  s = s.replace(/\s*[（(]\s*$/g, '')
  s = s.replace(/\s{2,}/g, ' ')
  s = s.replace(/\s+([，,。）)])/g, '$1')
  return s.trim()
}

const GLOBAL_RULES = [
  ['R1', '一册一色相', '一份手册只有一个品牌色相，副色仅用于图表橙'],
  ['R4', '组件不写死色', '颜色一律从主题令牌派生，禁止页面里出现 hex'],
  ['R14', '一站一拓扑', '同一语义全册只用一种拓扑；不同语义绝不共用'],
  ['R16', '两种表格语体不混', '营销参数表 SpecTable ↔ 技术数据表 InstrumentReportPanel'],
  ['R22', '类目色纪律', '多档配色默认同色相（tone）；跨色相须显式且全册锁定'],
  ['R23', '配色随来源，不随默认', '保持组件来源手册的色相，不得把所有组件统一成蓝色'],
]

/* ---------- 复制按钮 ---------- */
function CopyBtn({ label, payload, onDone, tone = 'ghost' }) {
  const [hit, setHit] = useState(false)
  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(payload)
      } else {
        // 非安全上下文的兜底（老浏览器 / file:// 打开时）
        const ta = document.createElement('textarea')
        ta.value = payload
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setHit(true)
      setTimeout(() => setHit(false), 1400)
    } catch (e) {
      onDone && onDone('复制失败：' + e.message)
    }
  }
  const solid = tone === 'solid'
  return (
    <button
      onClick={copy}
      title={'复制 ' + label}
      style={{
        cursor: 'pointer', font: 'inherit', fontSize: '11px', fontWeight: 600,
        padding: '5px 10px', borderRadius: '999px', lineHeight: 1.2,
        border: '1px solid ' + (hit ? '#2F7D4F' : solid ? '#2A2A2A' : '#D8D8D8'),
        background: hit ? '#E7F4EC' : solid ? '#2A2A2A' : '#FFFFFF',
        color: hit ? '#1E6B41' : solid ? '#FFFFFF' : '#3A3A3A',
        transition: 'all .15s',
      }}
    >
      {hit ? '已复制 ✓' : label}
    </button>
  )
}

/* ---------- 契约行 ---------- */
function Field({ k, v, children }) {
  if (!v && !children) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '82px 1fr', gap: '10px', padding: '4px 0', alignItems: 'start' }}>
      <div style={{ fontSize: '11px', color: '#9A9A9A', fontWeight: 600, paddingTop: '1px' }}>{k}</div>
      <div style={{ fontSize: '12.5px', color: '#2E2E30', lineHeight: 1.6 }}>{children || v}</div>
    </div>
  )
}

/* ---------- 单个组件卡 ---------- */
function Card({ c }) {
  const hexes = hexesOf(c.contract.hue)        // 全部来源色；[] = 该组件不引入色相
  const hueText = hueLabel(c.contract.hue)     // 摘掉色值后的出处说明
  const chip = hexes[0] || null                // 族章圆点；null 时画空心圈，不冒充灰色
  return (
    <div style={{
      background: '#fff', border: '1px solid #E4E4E4', borderRadius: '10px',
      padding: '18px 20px 16px', marginBottom: '14px',
    }}>
      {/* 标题行 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: '16px', fontWeight: 700, color: '#1C1C1E' }}>{c.name}</span>
        <span style={{
          fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
          background: chip ? chip + '22' : '#FAFAFA',
          color: '#333',
          border: '1px solid ' + (chip ? chip + '66' : '#E4E4E4'),
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
            ...(chip
              ? { background: chip }
              : { background: 'transparent', border: '1px solid #C4C4C4' }),
          }} />
          族 {c.family} · {c.familyName}
        </span>
        <span style={{ fontSize: '10.5px', color: '#8A8A8A', fontFamily: MONO }}>{c.since}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <CopyBtn label="复制提示词" payload={c.prompt} tone="solid" />
          <CopyBtn label="配置代码" payload={c.import + '\n\n' + c.usage + '\n'} />
          <CopyBtn label="源码" payload={c.source} />
          <CopyBtn label="import" payload={c.import} />
        </span>
      </div>

      {/* 契约 */}
      <div style={{ marginTop: '12px', borderTop: '1px solid #F0F0F0', paddingTop: '8px' }}>
        <Field k="语义" v={c.contract.intent} />
        <Field k="何时用" v={c.contract.use} />
        <Field k="何时不用" v={c.contract.notfor} />
        {c.contract.pairs && <Field k="配套" v={c.contract.pairs} />}
        <Field k="来源配色">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {hexes.length ? (
              /* 来源色可能不止一个（一册一色相 → 多册多色相全部列出），逐个画出来 */
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                {hexes.map((h) => (
                  <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '12px', height: '12px', borderRadius: '3px', background: h,
                      border: '1px solid rgba(0,0,0,.18)', display: 'inline-block', flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: MONO, fontSize: '11.5px', fontWeight: 700, color: '#2E2E30' }}>{h}</span>
                  </span>
                ))}
              </span>
            ) : (
              /* 不引入色相：画一个斜纹占位块 —— 刻意不用灰色实心，
                 否则会被误读成"这个组件的颜色就是灰的" */
              <span
                title="该组件不引入色相：颜色由调用页主题令牌决定"
                style={{
                  width: '12px', height: '12px', borderRadius: '3px', display: 'inline-block', flexShrink: 0,
                  border: '1px dashed #BFBFBF',
                  background: 'repeating-linear-gradient(45deg,#FAFAFA,#FAFAFA 3px,#EDEDED 3px,#EDEDED 6px)',
                }}
              />
            )}
            {hueText && <span style={{ color: '#6A6A6A' }}>{hueText}</span>}
          </span>
        </Field>
        {c.contract.evidence && <Field k="来源证据" v={c.contract.evidence} />}
      </div>

      {/* 用法 + props */}
      <div style={{
        marginTop: '10px', background: '#FAFAFA', border: '1px solid #EFEFEF',
        borderRadius: '7px', padding: '10px 12px',
      }}>
        <div style={{ fontFamily: MONO, fontSize: '11.5px', color: '#1F4E79', wordBreak: 'break-all', lineHeight: 1.65 }}>
          {c.usage}
        </div>
        <div style={{ marginTop: '7px', fontSize: '11px', color: '#8A8A8A', fontFamily: MONO, lineHeight: 1.6 }}>
          ({c.props.map((p) => (p.default === null ? p.name : p.name + '=' + p.default)).join(', ')})
        </div>
      </div>

      <details style={{ marginTop: '8px' }}>
        <summary style={{ cursor: 'pointer', fontSize: '11.5px', color: '#7A7A7A', padding: '3px 0' }}>
          查看源码（{c.file} · {c.source.split('\n').length} 行）
        </summary>
        <pre style={{
          margin: '6px 0 0', padding: '12px', background: '#F7F7F7', border: '1px solid #EDEDED',
          borderRadius: '7px', fontSize: '10.5px', lineHeight: 1.55, overflowX: 'auto',
          fontFamily: MONO, color: '#333', maxHeight: '340px',
        }}>{c.source}</pre>
      </details>
    </div>
  )
}

/* ---------- 页面 ---------- */
export function AppRegistry() {
  const [q, setQ] = useState('')
  const [fam, setFam] = useState('ALL')
  const [note, setNote] = useState('')

  const fams = registry.families
  const list = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return registry.components.filter((c) => {
      if (fam !== 'ALL' && c.family !== fam) return false
      if (!kw) return true
      return [c.name, c.familyName, c.contract.intent, c.contract.use, c.contract.notfor,
        c.contract.hue, c.contract.evidence, c.pairs].join(' ').toLowerCase().includes(kw)
    })
  }, [q, fam])

  const allPrompts = list.map((c) => c.prompt).join('\n\n---\n\n')

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '26px 22px 60px' }}>
      {/* 头部 */}
      <div style={{ background: '#fff', border: '1px solid #E4E4E4', borderRadius: '12px', padding: '22px 24px' }}>
        <h1 style={{ fontSize: '25px', fontWeight: 800, letterSpacing: '-0.3px', color: '#17171A' }}>
          组件提示词实验室
        </h1>
        <p style={{ marginTop: '7px', fontSize: '13px', color: '#5A5A5C', lineHeight: 1.75 }}>
          每个组件都有四件可复制的产物 —— <b>提示词</b>（语义 + 禁用 + 配色 + 约束）、<b>配置代码</b>（可运行 JSX）、
          <b>源码</b>、<b>import</b>。内容全部由 <code style={{ fontFamily: MONO, fontSize: '12px' }}>scripts/registry.mjs</code> 从
          源码里的 <code style={{ fontFamily: MONO, fontSize: '12px' }}>@ds-contract</code> 生成，
          再由 <code style={{ fontFamily: MONO, fontSize: '12px' }}>npm run audit</code> 反查一致性 ——
          所以这里显示的属性名不可能与代码不符（<b>这正是"输出质量漂移"的根因</b>）。
        </p>
        <div style={{ display: 'flex', gap: '18px', marginTop: '13px', flexWrap: 'wrap', fontSize: '12px', color: '#4A4A4C' }}>
          <span><b style={{ fontSize: '17px', color: '#17171A' }}>{registry.counts.components}</b> 个组件</span>
          <span><b style={{ fontSize: '17px', color: '#17171A' }}>{registry.counts.families}</b> 个族</span>
          <span><b style={{ fontSize: '17px', color: '#17171A' }}>{registry.counts.rules}</b> 条规则</span>
          <span style={{ color: '#9A9A9A' }}>v{registry.version}</span>
        </div>

        {/* 全局约束 */}
        <div style={{ marginTop: '16px', borderTop: '1px solid #F0F0F0', paddingTop: '13px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8A8A8A', marginBottom: '8px' }}>
            全局约束（每个提示词都已自带，此处便于通读）
          </div>
          {/* 两列而非三列：R2 / R22 的描述较长（含 SpecTable↔InstrumentReportPanel 这类
              组件名），三列会把它们挤成难读的碎行 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(430px, 1fr))', gap: '5px 26px' }}>
            {GLOBAL_RULES.map(([id, name, desc]) => (
              <div key={id} style={{ fontSize: '12px', color: '#4A4A4C', lineHeight: 1.6 }}>
                <span style={{
                  fontFamily: MONO, fontSize: '10.5px', fontWeight: 700, color: '#fff',
                  background: id === 'R23' ? '#B23A48' : '#9A9A9A', padding: '1px 6px',
                  borderRadius: '4px', marginRight: '7px',
                }}>{id}</span>
                <b>{name}</b>
                <span style={{ color: '#7A7A7A' }}> — {desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 工具条 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5, background: '#e8e8e8',
        padding: '14px 0 10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜组件名 / 语义 / 场景 / 来源配色…"
          style={{
            flex: '1 1 280px', minWidth: '220px', font: 'inherit', fontSize: '13px',
            padding: '9px 13px', borderRadius: '8px', border: '1px solid #DADADA', background: '#fff', outline: 'none',
          }}
        />
        <span style={{ fontSize: '12px', color: '#7A7A7A' }}>{list.length} / {registry.counts.components}</span>
        <CopyBtn label="复制本筛选下全部提示词" payload={allPrompts} tone="solid" onDone={setNote} />
      </div>

      {/* 族筛选 */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {[{ letter: 'ALL', name: '全部', components: [] }].concat(fams).map((f) => {
          const on = fam === f.letter
          return (
            <button
              key={f.letter}
              onClick={() => setFam(f.letter)}
              style={{
                cursor: 'pointer', font: 'inherit', fontSize: '12px', fontWeight: 600,
                padding: '5px 11px', borderRadius: '999px', lineHeight: 1.3,
                border: '1px solid ' + (on ? '#2A2A2A' : '#D8D8D8'),
                background: on ? '#2A2A2A' : '#fff', color: on ? '#fff' : '#4A4A4C',
              }}
            >
              {f.letter === 'ALL' ? f.name : '族 ' + f.letter + ' · ' + f.name}
              <span style={{ opacity: 0.6, marginLeft: '6px' }}>
                {f.letter === 'ALL' ? registry.counts.components : f.components.length}
              </span>
            </button>
          )
        })}
      </div>

      {note && (
        <div style={{ fontSize: '12px', color: '#B23A48', marginBottom: '10px' }}>{note}</div>
      )}

      {list.length === 0
        ? <div style={{ fontSize: '13px', color: '#8A8A8A', padding: '30px 0' }}>没有匹配的组件。</div>
        : list.map((c) => <Card key={c.name} c={c} />)}
    </div>
  )
}

export default AppRegistry
