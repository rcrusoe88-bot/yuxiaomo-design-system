// 族 A 结构页：封面 / 章节总览页 / 封底（R2：满版深底只允许这三类页）
import { useTheme } from './theme'
import { CapsuleDecor } from './primitives'
import { Icon } from './icons'

// ---------- A1 封面 ----------
export function Cover({ title, enTitle, logo, tagline, children, style }) {
  const t = useTheme()
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: t.dark, color: '#fff', ...style,
    }}>
      <CapsuleDecor preset="cover" />
      {/* 右上反白 logo 区 */}
      <div style={{ position: 'absolute', top: '22mm', right: '18mm', textAlign: 'right' }}>
        {logo || (
          <div style={{ fontSize: '17pt', fontWeight: 800, letterSpacing: '0.5px' }}>
            YourBrand
            {tagline && <div style={{ fontSize: '7pt', fontWeight: 400, opacity: 0.9 }}>{tagline}</div>}
          </div>
        )}
      </div>
      {/* 右中标题组 */}
      <div style={{ position: 'absolute', top: '96mm', left: '96mm', right: '16mm' }}>
        <div style={{ fontSize: '34pt', fontWeight: 800, lineHeight: 1.28 }}>{title}</div>
        {enTitle && <div style={{ fontSize: '16pt', fontWeight: 400, marginTop: '5mm', lineHeight: 1.4 }}>{enTitle}</div>}
        {children}
      </div>
    </div>
  )
}

// ---------- A2 章节总览页（深色氛围 + 白色信息岛） ----------
export function SectionDivider({ chapterNo, title, lead, children, style }) {
  const t = useTheme()
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: t.dark, color: '#fff', padding: '26mm 15mm 20mm', boxSizing: 'border-box', ...style,
    }}>
      <CapsuleDecor preset="corner" style={{ opacity: 0.55 }} />
      {chapterNo && <div style={{ fontSize: '13pt', fontWeight: 700, opacity: 0.9, marginBottom: '3mm' }}>{chapterNo}</div>}
      <div style={{ fontSize: '26pt', fontWeight: 800, lineHeight: 1.3 }}>{title}</div>
      {lead && (
        <p style={{ fontSize: '10pt', lineHeight: 1.8, marginTop: '6mm', maxWidth: '165mm', opacity: 0.95 }}>{lead}</p>
      )}
      {/* 白色信息岛 */}
      <div style={{
        position: 'absolute', left: '15mm', right: '15mm', bottom: '20mm',
        background: '#fff', borderRadius: '6mm', color: '#333', padding: '9mm 10mm',
      }}>
        {children}
      </div>
    </div>
  )
}

// ---------- 白色信息岛内：bullet 网格（NA p2 六宫格） ----------
export function IslandBulletGrid({ groups }) {
  const t = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6mm 8mm' }}>
      {groups.map((g, i) => (
        <div key={i}>
          <div style={{ color: t.functional, fontWeight: 700, fontSize: '10.5pt', marginBottom: '1.5mm' }}>{g.title}</div>
          {g.bullets.map((b, j) => (
            <div key={j} style={{ color: '#4D4D4F', fontSize: '8.5pt', lineHeight: 1.55, marginBottom: '1mm' }}>
              <span style={{ color: t.functional, marginRight: '1.2mm' }}>•</span>{b}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ---------- A4 封底（满版胶囊矩阵 + 联系列表 + 日期版本码） ----------
export function BackCover({ contacts, version, heading = '更多详情，欢迎访问', style }) {
  const t = useTheme()
  const icons = { web: 'globe', phone: 'phone', mail: 'mail', addr: 'pin' }
  return (
    <div className="bds-page" style={{
      width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden',
      background: '#fff', ...style,
    }}>
      <CapsuleDecor preset="backcover" />
      <div style={{ position: 'absolute', left: '14mm', bottom: '16mm', zIndex: 2 }}>
        <div style={{ fontWeight: 700, fontSize: '10.5pt', color: '#414042', marginBottom: '3mm' }}>{heading}</div>
        {contacts.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.5mm', marginBottom: '2.2mm' }}>
            <Icon name={icons[c.type] || 'globe'} size={13} primary="#6B6B6E" secondary="#6B6B6E" />
            <span style={{ fontSize: '9pt', color: '#4D4D4F' }}>{c.text}</span>
          </div>
        ))}
        {version && <div style={{ fontSize: '7.5pt', color: '#9A9A9C', marginTop: '5mm' }}>{version}</div>}
      </div>
    </div>
  )
}
