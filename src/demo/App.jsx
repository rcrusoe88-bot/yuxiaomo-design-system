// Demo：三套主题巡展。蓝主题完整 5 页（封面/卖点/参数/证据/封底），红紫各 3 页。
import {
  ThemeProvider, Page, Cover, SectionDivider, IslandBulletGrid, BackCover,
  PillTitle, H2, Sub, Lead, Footnotes,
  StatCardRow, TierCards, ConclusionBanner, TestimonialCard,
  SpecTable, TierMatrixTable, FlowChain, IconFlowBar, TimelineBar, ChevronFlow,
  CaseBlock, EvidenceGrid, DataChart,
} from '../lib'

const Banner = ({ children }) => <div className="bds-demo-banner">{children}</div>

// ============ 蓝主题 · mRNA-LNP 服务手册（远泰风格文案演示） ============
function BlueDemo() {
  return (
    <ThemeProvider theme="blue">
      <Banner>Theme: blue（深海蓝 #019EDB）—— 完整 5 页叙事：封面→卖点→参数→证据→封底</Banner>

      <Cover title={<>mRNA-LNP<br />技术服务手册</>} enTitle="mRNA-LNP Service Brochure" tagline="Scripting Possibilities" />

      <Page number={1} folioSide="left">
        <PillTitle>端到端 mRNA-LNP 开发服务</PillTitle>
        <Lead>
          作为一站式 CDMO 服务商，我们为您提供从序列设计、LNP 制剂开发到分析方法验证的整体解决方案，
          加速 mRNA 药物从概念到临床样品的转化，支持 µg 到 g 级规模的柔性交付。
        </Lead>
        <StatCardRow items={[
          { icon: 'timer', title: '快至 2 周交付', desc: '序列到 LNP 制剂成品' },
          { icon: 'shield', title: '包封率 ≥ 90%', desc: '微流控工艺、批间稳定' },
          { icon: 'dna', title: '全流程解决方案', desc: '设计·合成·递送·检测' },
          { icon: 'chart', title: 'µg 到 g 级产能', desc: 'RUO 至 GMP 级别' },
        ]} />
        <H2>服务流程</H2>
        <FlowChain steps={[
          { name: '序列设计', cycle: '3 天起', desc: '密码子与 UTR 优化，提升表达效率', bullets: ['AI 辅助序列设计', '跨物种表达策略'] },
          { name: 'mRNA 合成', cycle: '1 周起', desc: 'IVT 合成，加帽率与纯度双控', bullets: ['Cap1 加帽 ≥95%', 'dsRNA 残留控制'] },
          { name: 'LNP 封装', cycle: '1 周起', desc: '微流控制备，粒径 60–100 nm', bullets: ['包封率 ≥90%', 'PDI ≤0.2'] },
          { name: '分析放行', cycle: '3 天起', desc: '理化 + 细胞功能双重质控', bullets: ['转染效率 FACS 验证', '内毒素 <0.1 EU/mL'] },
        ]} />
        <TimelineBar
          segments={[{ label: '3 天', weeks: 0.5 }, { label: '1 周', weeks: 1 }, { label: '1 周', weeks: 1 }, { label: '3 天', weeks: 0.5 }]}
          total="快至 2.5 周交付"
        />
      </Page>

      <Page number={2} folioSide="right">
        <H2>服务规格</H2>
        <Sub>从 RUO 到 GMP 级别，支持完全定制</Sub>
        <SpecTable
          columns={['服务名称', '服务内容', '质控标准', '交付形式', '生产周期']}
          rows={[
            [{ v: 'mRNA 合成服务', rowSpan: 1, bold: true }, '• 序列优化与合成\n• 修饰核苷酸可选（m1ψ 等）', '纯度 ≥90%\ndsRNA 阴性', '冻干粉 / 溶液', '1 周起'],
            [{ v: 'LNP 制剂服务', bold: true }, '• 微流控封装\n• 靶向配体偶联（抗体/多肽）', { v: '包封率 ≥90%', highlight: true }, '液体 / 冻干', { v: '2 周起', highlight: true }],
          ]}
        />
        <Footnotes items={['其他规格与交付量欢迎详询；同时提供 saRNA、circRNA 等定制化合成服务。']} />
        <H2>三档开发套餐</H2>
        <TierCards
          tiers={[
            { name: '基础验证套餐', cycle: '2 周', price: '3 万元起', desc: '1 条序列 + 标准 LNP，含体外转染验证' },
            { name: '精选开发套餐', cycle: '4 周', price: '8 万元起', desc: '3 条序列平行筛选，含粒径/电位全表征' },
            { name: '高级定制套餐', cycle: '8 周', price: '20 万元起', desc: '靶向 LNP 开发 + 动物水平递送验证' },
          ]}
          footnote="* 各套餐均可加购体内分布（IVIS）、免疫原性（ELISA）等检测项。"
        />
        <H2>服务等级对比</H2>
        <TierMatrixTable
          tiers={['RUO', 'IND-enabling', 'cGMP']}
          features={[
            { name: '全长测序放行', values: [true, true, true] },
            { name: '无菌灌装', values: [false, true, true] },
            { name: '方法学验证报告', values: [false, true, true] },
            { name: '稳定性考察', values: [false, false, true] },
          ]}
        />
      </Page>

      <Page number={3} folioSide="left">
        <H2>案例分享</H2>
        <CaseBlock
          title="案例 1：脾脏靶向 LNP 递送效率优化"
          facts={[
            { k: '技术难点', v: '标准 MC3 配方脾脏表达低，客户需在体免疫细胞编辑场景' },
            { k: '解决方案', v: '筛选 12 组离子化脂质库 + 表面抗体偶联，构建 T 细胞靶向 tLNP' },
            { k: '结果', v: '脾脏荧光素酶表达提升 40 倍，T 细胞转染率由 3% 提升至 61%' },
          ]}
        />
        <DataChart
          title="不同配方 LNP 的 T 细胞转染效率对比（FACS）"
          groups={[
            { label: 'MC3', a: 3, b: 5 },
            { label: '候选 A', a: 18, b: 26 },
            { label: '候选 B', a: 31, b: 44 },
            { label: 'tLNP-B', a: 48, b: 61 },
            { label: 'PC', a: 62, control: true },
          ]}
          seriesNames={['CD4+', 'CD8+']}
        />
        <ConclusionBanner>
          经两轮脂质库筛选，tLNP-B 将 T 细胞在体转染率提升至 <b>61%</b>，项目周期 <b>8 周</b>完成交付
        </ConclusionBanner>
        <TestimonialCard
          quote="Their consultation made it easy to determine which formulation was best suited for our in vivo CAR-T program. We were impressed with the delivery timeline."
          name="Poonam Pandey" org="Tavotek Biotherapeutics"
        />
      </Page>

      <BackCover
        contacts={[
          { type: 'web', text: 'www.yourcompany.com.cn' },
          { type: 'phone', text: '400-000-0000' },
          { type: 'mail', text: 'service@yourcompany.com.cn' },
          { type: 'addr', text: '湖南省长沙市XX区XX路XX号' },
        ]}
        version="09192026"
      />
    </ThemeProvider>
  )
}

// ============ 红主题 · 细胞工程（3 页） ============
function RedDemo() {
  return (
    <ThemeProvider theme="red">
      <Banner>Theme: red（信号红 #EE3451）—— 章节总览页 + 图标流程 + 封底</Banner>

      <SectionDivider
        chapterNo="CHAPTER 01"
        title="细胞工程服务"
        lead={<>依托 20+ 年经验，为您提供从载体构建到稳定细胞系的一站式解决方案，已交付 <b style={{ color: '#EE3451' }}>10,000+</b> 细胞株构建项目。</>}
      >
        <IslandBulletGrid groups={[
          { title: '慢病毒包装', bullets: ['滴度 ≥1E+8 TU/mL', '科研至 GMP 级别'] },
          { title: '稳定细胞系', bullets: ['5 周起交付', '100% 精准交付'] },
          { title: '基因编辑', bullets: ['CRISPR 全流程', '编辑效率 ≥80%'] },
        ]} />
      </SectionDivider>

      <Page number={4} folioSide="right">
        <PillTitle>慢病毒包装服务</PillTitle>
        <Lead>提供从载体构建、病毒包装到纯化质检的一站式服务，默认 HPLC 级别纯化，批次间稳定。</Lead>
        <IconFlowBar steps={[
          { icon: 'dna', name: '载体构建' }, { icon: 'cell', name: '病毒包装' },
          { icon: 'box', name: '浓缩纯化' }, { icon: 'flask', name: '滴度检测' }, { icon: 'truck', name: '交付放行' },
        ]} />
        <H2>交付规格</H2>
        <SpecTable
          labelColumn
          columns={['项目阶段', '服务内容', '周期', '交付物']}
          rows={[
            [{ v: '阶段 I', bold: true }, '载体构建与序列验证', '1 周', '测序报告'],
            [{ v: '阶段 II', bold: true }, '病毒包装与浓缩', '2 周', '粗提病毒液'],
            [{ v: '阶段 III', bold: true }, '纯化与滴度检测', '1 周', { v: '≥1E+8 TU/mL 病毒液', highlight: true }],
          ]}
        />
        <TimelineBar segments={[{ label: '1 周', weeks: 1 }, { label: '2 周', weeks: 2 }, { label: '1 周', weeks: 1 }]} total="4 周起" />
      </Page>

      <BackCover contacts={[{ type: 'web', text: 'www.yourcompany.com' }, { type: 'mail', text: 'cell@yourcompany.com' }]} version="09192026" />
    </ThemeProvider>
  )
}

// ============ 紫主题 · 蛋白服务（3 页） ============
function PurpleDemo() {
  return (
    <ThemeProvider theme="purple">
      <Banner>Theme: purple（学术紫 #682E79）—— 封面 + Chevron 漏斗 + 证据图组</Banner>

      <Cover title={<>蛋白表达<br />服务手册</>} enTitle="Protein Expression Service" tagline="Scripting Possibilities" />

      <Page number={5} folioSide="left">
        <PillTitle>TurboCHO™ 高通量表达平台</PillTitle>
        <Lead>覆盖从基因合成到规模化纯化的完整链条，高通量平台支持数百个抗体并行表达。</Lead>
        <ChevronFlow steps={['基因合成', '载体构建', '瞬时表达', '纯化', 'QC 放行']} />
        <H2>表达量与周期承诺</H2>
        <SpecTable
          columns={['平台', '表达量', '规模', '交付周期']}
          rows={[
            ['TurboCHO™ 2.0', { v: '2.4 g/L', highlight: true }, '1–30 mL', { v: '快至 7 个自然日', highlight: true }],
            ['Bac-to-Bac™', '50–500 mg/L', '昆虫细胞', '4 周起'],
          ]}
        />
        <EvidenceGrid
          images={[1, 2, 3].map((i) => ({ src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="200" height="120" fill="#F2F0F5"/><text x="100" y="66" font-size="14" fill="#9664AA" text-anchor="middle">SEC 谱图 ${i}</text></svg>`)}`, caption: `纯化批次 ${i}` }))}
          note="SEC-HPLC 检测纯度均 ≥95%"
        />
        <ConclusionBanner>高通量平台单批次交付 <b>157,000 个抗体</b>，项目准时率 <b>98%</b></ConclusionBanner>
      </Page>

      <BackCover contacts={[{ type: 'web', text: 'www.yourcompany.com' }, { type: 'phone', text: '400-000-0001' }]} version="09192026" />
    </ThemeProvider>
  )
}

export function App() {
  return (
    <>
      <BlueDemo />
      <RedDemo />
      <PurpleDemo />
    </>
  )
}
