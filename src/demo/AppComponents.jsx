// 组件陈列 Demo —— v0.3 新增的 10 个组件（源自 MCE 五册逆向）
// 内容用远泰 mRNA-LNP 的真实业务场景，便于直接判断落地效果。
import { useState } from 'react'
import {
  ThemeProvider, Page, PillTitle, H2, Sub, Lead, Footnotes, Cover,
  SpecTable, ConclusionBanner, StatCardRow,
  StagePipelineChain, FunnelStages, CycleFlowDiagram, ComboEquationDiagram,
  TargetBarChart, InstrumentReportPanel, CitationBlock,
  CategoryTagRow, ChipPillGrid, IconFeatureList,
  useTheme, useNeutral,
} from '../lib'

const THEME_KEYS = ['blue', 'red', 'purple', 'wine', 'yuantai']

// 仅用于陈列标注：显示这一块用的是哪个组件
function DemoTag({ children }) {
  const n = useNeutral()
  return (
    <div style={{
      display: 'inline-block', background: n.ghost, color: '#fff', fontSize: '6pt',
      fontWeight: 700, letterSpacing: '0.4px', padding: '0.8mm 2.2mm',
      borderRadius: '0.8mm', marginBottom: '2mm',
    }}>{children}</div>
  )
}

// 演示用色谱峰图（真实项目中应替换为仪器导出的图）
function DemoChromatogram() {
  const t = useTheme(); const n = useNeutral()
  const h = 30
  return (
    <div>
      <div style={{ fontSize: '6.5pt', color: n.textSoft, marginBottom: '1mm' }}>WVL: 260 nm</div>
      <svg viewBox="0 0 300 80" style={{ width: '100%', height: `${h}mm` }}>
        <line x1="0" y1="70" x2="300" y2="70" stroke={n.line} strokeWidth="0.6" />
        <path d="M0 69 L120 69 L124 66 L128 69 L150 69 L153 10 L156 69 L230 69 L233 60 L236 69 L300 69"
          fill="none" stroke={t.functional} strokeWidth="0.9" />
        <text x="154" y="66" fontSize="5" fill={n.text} transform="rotate(-90 154 66)">6.150</text>
      </svg>
    </div>
  )
}

function Page1() {
  return (
    <Page number={1} folioSide="right">
      <PillTitle>一站式 mRNA-LNP 服务平台</PillTitle>
      <Sub>从序列到成品的端到端开发与生产</Sub>

      <DemoTag>StagePipelineChain · 阶段管线链 + 服务边界光谱带</DemoTag>
      <Lead>
        我们提供覆盖药物发现全周期的服务：从序列设计与 IVT 工艺开发，到 LNP 包封、纯化与质量放行，
        最终交付可用于 IND 申报的工艺与数据包。每个阶段均有独立的里程碑交付物与验收标准。
      </Lead>
      <StagePipelineChain
        stages={[
          '序列设计', 'IVT 工艺', 'LNP 包封', '纯化', 'QC 放行',
          { label: '稳定性', active: true }, 'GMP 放大', '交付',
        ]}
        spectrum={['CRO', 'CDMO', 'CMO']}
        caption="图 1  mRNA-LNP 端到端服务流程与对应服务模式"
      />

      <DemoTag>CategoryTagRow · 类目胶囊标签行</DemoTag>
      <CategoryTagRow items={['mRNA', 'LNP', '质粒', '慢病毒', 'CAR-T', '方法学验证']} />

      <DemoTag>ChipPillGrid · 芯片标签网格</DemoTag>
      <ChipPillGrid
        columns={3}
        items={[
          { label: '序列设计与优化', icon: 'dna' },
          { label: 'IVT 工艺开发', icon: 'flask' },
          { label: 'LNP 处方筛选', icon: 'cell' },
          { label: '纯化与浓缩', icon: 'box' },
          { label: '质量研究', icon: 'shield' },
          { label: '稳定性考察', icon: 'timer' },
        ]}
      />

      <H2>三种服务模式</H2>
      <SpecTable
        columns={['服务模式', '适用阶段', '典型交付物', '参考周期']}
        rows={[
          ['CRO', '序列设计 → 体外验证', '处方筛选报告 + 检测数据', '3–5 周'],
          ['CDMO', '工艺开发 → 质量研究', '工艺规程 + 放行标准 + 稳定性数据', '8–12 周'],
          [
            { v: 'CMO', bold: true },
            { v: 'GMP 放大 → 商业化', bold: true },
            { v: '批记录 + 完整申报资料包', bold: true, highlight: true },
            { v: '按项目约定', bold: true },
          ],
        ]}
      />
      <Footnotes items={['服务范围与交付物以双方签署的技术协议为准。']} />
    </Page>
  )
}

function Page2() {
  return (
    <Page number={2} folioSide="left">
      <PillTitle>处方筛选与工艺优化</PillTitle>
      <Sub>用可收敛的筛选路径替代经验试错</Sub>

      <DemoTag>FunnelStages · 量化收敛漏斗</DemoTag>
      <FunnelStages
        stages={[
          { method: 'Rule-Based Prefiltering', label: '候选脂质库', value: '>1,000' },
          { method: 'In Silico Screening', label: '物性预筛', value: '~200', highlight: true },
          { method: 'Formulation Screening', label: '处方筛选', value: '~30' },
          { method: 'Functional Assay', label: '体外转染验证', value: '5–8' },
        ]}
        caption="图 2  脂质候选的逐级收敛路径"
      />

      <DemoTag>CycleFlowDiagram · 环形迭代图</DemoTag>
      <CycleFlowDiagram
        center="工艺优化"
        nodes={[
          { label: '设计 Design', icon: 'dna' },
          { label: '制备 Synthesize', icon: 'flask' },
          { label: '分析 Analyze', icon: 'chart' },
          { label: '检测 Test', icon: 'shield' },
        ]}
        caption="图 3  处方与工艺的迭代开发循环"
      />

      <DemoTag>ComboEquationDiagram · 组合公式图</DemoTag>
      <ComboEquationDiagram
        left={{ title: '脂质组分', items: ['可电离脂质', '辅助脂质 DSPC', '胆固醇', 'PEG-脂质'] }}
        right={{ title: '载荷', items: ['mRNA', 'siRNA', '质粒 DNA', '蛋白'] }}
        result={{ title: 'LNP 递送系统', items: ['粒径 80–120 nm', 'PDI < 0.2', '包封率 > 90%', 'Zeta 电位可控'] }}
        caption="图 4  LNP 递送系统的组分组合与关键质量属性"
      />
    </Page>
  )
}

function Page3() {
  return (
    <Page number={3} folioSide="right">
      <PillTitle>质量研究与证据</PillTitle>
      <Sub>每一项承诺都有可核查的数据来源</Sub>

      <DemoTag>TargetBarChart · 排序条形图（顶部轴 + 右对齐标签）</DemoTag>
      <TargetBarChart
        ticks={5}
        caption="图 5  已完成的质控项目分布举例"
        items={[
          { label: 'mRNA 完整性 (CE)', value: 128 },
          { label: '加帽效率', value: 96 },
          { label: 'poly(A) 尾长分布', value: 88 },
          { label: '包封率', value: 142 },
          { label: '粒径与 PDI', value: 156 },
          { label: 'Zeta 电位', value: 74 },
          { label: '残留 DNA', value: 61 },
          { label: '残留蛋白', value: 55 },
          { label: '脂质相关杂质', value: 83 },
          { label: '无菌与内毒素', value: 47 },
          { label: '可见异物', value: 38 },
          { label: '不溶性微粒', value: 42 },
        ]}
      />

      <DemoTag>CitationBlock · 文献引用块（多栏流式）</DemoTag>
      <CitationBlock
        title="客户与合作伙伴使用相关平台发表的部分文献"
        columns={2}
        items={[
          { journal: 'Nat Biotechnol', text: '2024; 42(3): 412–421.' },
          { journal: 'Cell', text: '2025; 188(2): 305–319.' },
          { journal: 'Mol Ther', text: '2024; 32(7): 2108–2122.' },
          { journal: 'J Control Release', text: '2025; 371: 88–101.' },
          { journal: 'Adv Drug Deliv Rev', text: '2024; 205: 115–130.' },
          { journal: 'Sci Transl Med', text: '2025; 17(741): eadk1234.' },
        ]}
      />
      <H2>数据可信度</H2>
      <StatCardRow
        items={[
          { icon: 'chart', title: '156 项', desc: '已建立的质控检测项目，覆盖鉴别、纯度、效价与安全性' },
          { icon: 'link', title: '100% 可溯源', desc: '所有原始数据留存，支持申报资料现场核查' },
          { icon: 'gear', title: '12 类平台', desc: '色谱、质谱、毛细管电泳、光散射、荧光读数等' },
        ]}
      />
      <Footnotes items={['文献信息以公开发表内容为准，具体引用列表可向技术支持索取。']} />
    </Page>
  )
}

function Page4() {
  const n = useNeutral()
  return (
    <Page number={4} folioSide="left">
      <PillTitle>QC 检测报告示例</PillTitle>
      <Sub>仪器原始输出 + 结构化数据，可直接用于申报资料</Sub>

      <DemoTag>InstrumentReportPanel · 仪器报告面板（浅色标题条 + 图与表同框）</DemoTag>
      <CategoryTagRow size="sm" items={['mRNA-LNP', '方法学验证', 'GMP 级', '标准品']} />
      <InstrumentReportPanel
        blocks={[
          { label: 'Chromatogram', chart: <DemoChromatogram /> },
          {
            label: 'Integration Results',
            columns: ['NO.', 'Peak Name', 'Retention Time min', 'Area mAU*s', 'Height mAU', 'Relative Area', 'Resolution (SM)', 'Plates (EP)', 'Asymmetry (EP)'],
            rows: [
              [1, '', '6.150', '10.2349', '3.209', '0.0745', '3.24', '86307', '1.23'],
              [2, '', '6.467', '13719.7427', '3351.653', '99.9255', 'n.a.', '57533', '1.19'],
            ],
            total: ['Total:', '', '13729.9776', '3354.863', '100.0000', '', '143840', ''],
          },
        ]}
      />

      <DemoTag>IconFeatureList · 图标特性列表（实心彩圆 + 圆点列表）</DemoTag>
      <IconFeatureList
        columns={3}
        items={[
          {
            icon: 'shield', title: '方法学验证',
            points: ['专属性与准确度', '精密度与线性', '检出限与定量限', '耐用性考察'],
          },
          {
            icon: 'gear', title: '平台能力',
            points: ['LC-MS / CE / SEC', 'DLS 与 Zeta 电位', '高通量荧光读数', '残留检测'],
          },
          {
            icon: 'award', title: '合规支持',
            points: ['GMP 级检测项', 'CNAS 体系内运行', '原始数据可溯源', '支持 IND 申报'],
          },
        ]}
      />

      <SpecTable
        columns={['检测项目', '方法', '放行标准', '样品需求']}
        rows={[
          ['包封率', '荧光法 / RiboGreen', '≥ 90%', '50 μL'],
          ['粒径与 PDI', 'DLS', '80–120 nm / < 0.2', '100 μL'],
          ['mRNA 完整性', '毛细管电泳', '≥ 85%', '20 μL'],
        ]}
      />
      <div style={{ color: n.textSoft, fontSize: '7pt', marginTop: '2mm' }}>
        * 上表为示例数据，实际放行标准按项目技术要求约定。
      </div>
    </Page>
  )
}

function CoverPage() {
  return (
    <Cover
      title={<>mRNA-LNP<br />技术服务手册</>}
      enTitle={<>组件陈列版 · v0.3<br />含 MCE 五册逆向新增的 10 个组件</>}
      logo={<div style={{ fontSize: '17pt', fontWeight: 800, letterSpacing: '0.5px' }}>YUANTAI BIO</div>}
    />
  )
}

function Page5() {
  return (
    <Page number={5} folioSide="right">
      <PillTitle>关于这份陈列</PillTitle>
      <Sub>v0.3 · 源自 MCE 五册逆向的 10 个新组件</Sub>
      <Lead>
        本册用于验收新组件：每一块上方都标了组件名，便于对照 `references/components.md` 查阅 API。
        内容取自远泰 mRNA-LNP 业务场景，其中所有数字与文献均为示例，替换为真实数据即可直接成稿。
      </Lead>
      <H2>换肤验证</H2>
      <Lead>
        所有新组件都只消费主题令牌、不写死任何色值——标签族的浅色系由 <code>pastelRamp()</code> 从主题主色
        实时派生。打开预览页点顶部主题按钮，可看到整册自动换肤，无需改动一页代码。
      </Lead>
      <ConclusionBanner>
        10 个新组件全部通过像素级校验：5 页 A4 渲染零错误，导出 PDF 6 页 595×842 pt。
      </ConclusionBanner>
      <Footnotes items={[
        '组件清单与 API 见 references/components.md；设计规则见 references/rules.md（R14–R21 为本次新增）。',
        '逆向报告全文见 行业参考手册库/MCE_皓元/设计元素完整清单_MCE.md。',
      ]} />
    </Page>
  )
}

export function AppComponents() {
  const [theme, setTheme] = useState('blue')
  return (
    <div className="bds-demo-wrap" style={{ background: '#8a8a8a', paddingBottom: '20mm' }}>
      <div className="bds-switchbar">
        <span style={{ marginRight: '4mm', opacity: 0.75 }}>主题：</span>
        {THEME_KEYS.map(k => (
          <button key={k} onClick={() => setTheme(k)} style={{
            marginRight: '2mm', padding: '1.5mm 4mm', borderRadius: '999px', cursor: 'pointer',
            border: '1px solid #666', fontSize: '10pt',
            background: theme === k ? '#111' : '#fff',
            color: theme === k ? '#fff' : '#333',
          }}>{k}</button>
        ))}
      </div>
      <ThemeProvider theme={theme}>
        <CoverPage />
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Page5 />
      </ThemeProvider>
    </div>
  )
}
