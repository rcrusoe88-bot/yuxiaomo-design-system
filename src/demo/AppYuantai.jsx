// 远泰版演示：同一套 mRNA-LNP 手册文案，可一键切换 5 套主题对比。
// 默认远泰红（#D80000 + #606060）。打印/导出时切换条自动隐藏。
import { useState } from 'react'
import { THEMES } from '../lib/themes'
import {
  ThemeProvider, Page, Cover, BackCover,
  PillTitle, H2, Sub, Lead, Footnotes,
  StatCardRow, FlowChain, TimelineBar,
  SpecTable, TierCards, TierMatrixTable,
  CaseBlock, DataChart, ConclusionBanner, TestimonialCard,
} from '../lib'

function SwitchBar({ current, onSelect }) {
  return (
    <div className="bds-switchbar">
      {Object.entries(THEMES).map(([key, th]) => {
        const active = key === current
        return (
          <button key={key} onClick={() => onSelect(key)}
            style={{
              background: active ? th.functional : '#fff',
              color: active ? '#fff' : '#333',
              border: `1.5px solid ${th.functional}`,
            }}>{th.name}</button>
        )
      })}
      <span className="hint">点击切换主题 · 打印 / 导出 PDF 自动隐藏此条</span>
    </div>
  )
}

function YuantaiManual({ theme }) {
  return (
    <ThemeProvider theme={theme}>
      <Cover
        logo={(
          <div style={{ fontSize: '17pt', fontWeight: 800, letterSpacing: '1px', lineHeight: 1.2 }}>
            YUANTAI<span style={{ fontSize: '9pt', fontWeight: 400, display: 'block', marginTop: '1mm', opacity: 0.9 }}>湖南远泰生物 · mRNA-LNP CDMO</span>
          </div>
        )}
        title={<>mRNA-LNP<br />技术服务手册</>}
        enTitle="mRNA-LNP CDMO Service Brochure"
        tagline="一站式递送解决方案"
      />

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
            [{ v: 'mRNA 合成服务', bold: true }, '• 序列优化与合成\n• 修饰核苷酸可选（m1ψ 等）', '纯度 ≥90%\ndsRNA 阴性', '冻干粉 / 溶液', '1 周起'],
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
          quote="The tLNP platform delivered in vivo T-cell transfection at a level we hadn't seen with standard formulations, and the turnaround fit our IND-enabling timeline."
          name="R&D Lead, 核酸递送方向"
          org="国内某细胞治疗企业（匿名）"
        />
      </Page>

      <BackCover
        contacts={[
          { type: 'web', text: 'www.yuantai-bio.com' },
          { type: 'phone', text: '400-XXX-XXXX' },
          { type: 'mail', text: 'contact@yuantai-bio.com' },
          { type: 'addr', text: '湖南省长沙市（具体地址待填）' },
        ]}
        version="2026-09-19"
      />
    </ThemeProvider>
  )
}

export function App() {
  const [theme, setTheme] = useState('blue')
  return (
    <>
      <SwitchBar current={theme} onSelect={setTheme} />
      <YuantaiManual theme={theme} />
    </>
  )
}
