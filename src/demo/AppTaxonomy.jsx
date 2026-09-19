// 组件陈列 Demo v0.4 —— 按分类体系的「层」组织，逐层陈列 34 个新组件
// 内容用远泰 mRNA-LNP 业务场景；所有数字与文献均为**示例**，替换为真实数据即可成稿。
//
// 页面顺序 = 分类顺序 = 装配一页时的思考顺序：
//   标题 → 文本 → 表格 → 卡片 → 图形（拓扑 / 图表 / 图解）→ 家具 → 分类总表
//
// ⚠ 每页内容高度必须 ≤ 259mm（297 − 上下 18/20mm 版心）。A4 分页骨架里超出部分
//   会被 overflow:hidden **静默裁掉**而不报错，所以改完必须跑 `npm run verify`。
import { createContext, useContext, useState } from 'react'
import {
  ThemeProvider, Page, Cover,
  // 标题族
  PillTitle, H2, EyebrowTitle, PairTitle, BlockTitle, OutlineTitle, BarTitle, RuleTitle, NumberedTitle,
  // 文本族
  BodyText, BulletList, NumberedList, DefinitionList, NoteBand, AnnotationPair, FigCaption, Footnotes,
  // 表格 / 卡片
  RowLabelMatrixTable, MethodTable, KeyValueTable, ProductCardGrid, MetricStrip, TocList,
  // 拓扑 / 图表 / 图解 / 家具
  NumberedStepFlow, HexChain, BeadChain, AnnotatedCycle, ServiceNetworkMap, PhaseBand,
  PanelBarChart, AnnotatedDonut, ScatterClusterPanel,
  FigurePanel, LegendFigure, SwatchLegend, BrandHeaderBar, ContactFooterBand,
  useNeutral, useTheme,
  CORPORA, ORIGIN_KEYS, THEMES, manualLabel, defaultManualOf,
} from '../lib'
// 来源脉直接读 registry.json —— 它是 src/lib/*.jsx 契约的投影，
// 所以这张「组件 → 来源脉」的映射表**不必手写**，也就不会与契约漂移。
import registry from '../../registry.json'

const SRC_OF = Object.fromEntries(registry.components.map((c) => [c.name, c.contract.src || 'neutral']))
const MANUAL_OF = Object.fromEntries(registry.components.map((c) => [c.name, c.contract.manual || '']))
const HUE_OF = Object.fromEntries(registry.components.map((c) => [c.name, c.contract.hue || '']))
const ORIGIN_LABEL = Object.fromEntries(ORIGIN_KEYS.map((k) => [k, CORPORA[k].label]))
const BRAND_KEYS = Object.keys(THEMES)

/* 配色控制：来源模式（默认）/ 品牌模式。
   来源模式 = 每个演示单元按它自己声明的来源脉取色 —— R23 的可见证据；
   品牌模式 = 全册统一换肤，用于看成稿效果（与来源无关）。 */
const AtlasCtx = createContext({ mode: 'source', brand: 'yuantai', pick: {} })
/* 演示单元自己把「我是谁、来自哪条脉、现在用的是哪个主题」传给后代（DemoTag 取用） */
const SrcCtx = createContext(null)

function SrcBlock({ of, children }) {
  const { mode, brand, pick } = useContext(AtlasCtx)
  const src = SRC_OF[of] || 'neutral'
  // 优先级：品牌模式 > 该组件锁定的具体册 > 该脉当前选中的册。
  // neutral（不引入色相）随调用页主题 → 跟随 GenScript 侧的册。
  const pinned = MANUAL_OF[of]
  const themeKey = mode === 'brand' ? brand : (pinned || (src === 'mce' ? pick.mce : pick.genscript))
  return (
    <SrcCtx.Provider value={{ comp: of, src, pinned: !!pinned, themeKey, hue: HUE_OF[of] }}>
      <ThemeProvider theme={themeKey}>{children}</ThemeProvider>
    </SrcCtx.Provider>
  )
}

function DemoTag({ children }) {
  const n = useNeutral()
  const t = useTheme()
  const s = useContext(SrcCtx)
  if (s && !SRC_OF[s.comp]) console.warn(`[陈列] <SrcBlock of="${s.comp}"> 的组件名不在 registry.json 里`)
  // children 为空 = 这一块只挂来源徽标（该单元本来没有 API 提示）。
  // 这种徽标要收一档下边距：P1 一口气补了 5 个，满档会把这页顶溢出（v0.5 实测 2.6mm）。
  const bare = !children
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap',
      background: n.ghost, color: '#fff', fontSize: '6pt',
      fontWeight: 700, letterSpacing: '0.4px', padding: bare ? '0.6mm 2.2mm' : '0.8mm 2.2mm',
      borderRadius: '0.8mm', marginBottom: bare ? '0.6mm' : '2mm',
    }}>
      {children}
      {s && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1.4mm', marginLeft: children ? '2.6mm' : 0 }}>
          <span style={{
            width: '2.2mm', height: '2.2mm', borderRadius: '0.4mm', display: 'inline-block',
            background: t.functional, border: '0.4px solid rgba(255,255,255,.75)',
          }} />
          <span>{ORIGIN_LABEL[s.src] || s.src} · {manualLabel(s.themeKey)}{s.pinned ? '（锁定）' : ''}</span>
          <span style={{ opacity: 0.7, fontWeight: 500 }}>{t.functional}</span>
        </span>
      )}
    </div>
  )
}

// 示意图：抽象网络（**不是**科学插图，仅用于演示图解族的装框能力）
function DemoAbstractArt({ height = '30mm' }) {
  const n = useNeutral()
  return (
    <svg viewBox="0 0 120 88" preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height, display: 'block' }}>
      <circle cx="60" cy="42" r="30" fill="none" stroke={n.line} strokeWidth="0.7" strokeDasharray="2 2" />
      <circle cx="60" cy="42" r="21" fill="none" stroke={n.line} strokeWidth="0.7" />
      {[[42, 30], [76, 33], [52, 60], [78, 57]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={i % 2 ? '#C8C8C8' : '#9A9A9C'} />
      ))}
      {[[42, 30, 60, 42], [76, 33, 60, 42], [52, 60, 60, 42], [78, 57, 76, 33]].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={n.line} strokeWidth="0.6" />
      ))}
      <text x="60" y="82" fontSize="6" fill="#9A9A9C" textAnchor="middle">示意</text>
    </svg>
  )
}

/* ============ P1 · 标题层 ============ */
function Page1() {
  return (
    <Page number={1} folioSide="right">
      <PairTitle cn="标题层 · 9 种形态" eyebrow={['P1', '标题层']} />
      <BodyText size="sm" text="标题是手册里出现频率最高的元素。若每页都用同一种标题，整册会失去**层次与节奏**。本层按「底色从有到无」排列 9 种形态；一页只允许一个 H1 级标题。" />

      <SrcBlock of="EyebrowTitle">
      <RuleTitle en="EyebrowTitle">A · 眉标（可独立使用）</RuleTitle>
      <DemoTag />
      <EyebrowTitle items={['Cat. No.: YT-ML-2026', 'LNP 包封服务', 'v2.0']} />

      </SrcBlock>
      <SrcBlock of="BlockTitle">
      <RuleTitle en="BlockTitle / OutlineTitle">B · 方块实底 与 描边空心</RuleTitle>
      <DemoTag />
      <BlockTitle size="sm" width="86mm" inline>mRNA-LNP 一站式开发服务</BlockTitle>
      <OutlineTitle size="sm" width="86mm" inline style={{ marginTop: '2mm' }}>质粒 · 慢病毒 · CAR-T 检测</OutlineTitle>

      </SrcBlock>
      <SrcBlock of="PairTitle">
      <RuleTitle en="PairTitle">C · 中英对照（MCE 主力形态）</RuleTitle>
      <DemoTag />
      <PairTitle cn="脂质纳米颗粒质量控制体系" en="Quality Control System for Lipid Nanoparticles" size="md" />

      </SrcBlock>
      <SrcBlock of="BarTitle">
      <RuleTitle en="BarTitle / NumberedTitle">D · 左色条 与 编号</RuleTitle>
      <DemoTag />
      <BarTitle level={2} en="Encapsulation Efficiency"
        sub="包封率是 LNP 质量的核心指标，直接影响递送效率与批次一致性。" />
      <NumberedTitle index={3} total={6} size="sm" en="Analytical Development">分析方法开发</NumberedTitle>

      </SrcBlock>
      <SrcBlock of="PillTitle">
      <RuleTitle en="PillTitle / H2（原有两态，作对照）">E · 胶囊 与 无底居中</RuleTitle>
      <DemoTag />
      <H2 style={{ margin: '0 0 2.5mm' }}>收口用胶囊，分栏用方块，双语用中英对照</H2>
      <BodyText size="sm"
        text="页内小节用左色条，有序章节用编号，眉标负责承载目录号与分类。**同一页的标题形态不宜超过 3 种**。" />
      <PillTitle style={{ margin: '3mm 0 0' }}>形态选择指引</PillTitle>
      </SrcBlock>
    </Page>
  )
}

/* ============ P2 · 文本层 A ============ */
function Page2() {
  return (
    <Page number={2} folioSide="right">
      <PairTitle cn="文本层 A · 段落与列表" eyebrow={['P2', '文本层']} />
      <BodyText size="sm" text="系统原先只有 Lead / Sub / Footnotes 三个文本组件，而文本是手册占比最大的内容层。本层补齐后，**唯一允许的文本高亮手段**是行内加粗（MCE 规则），不加色、不加底、不加下划线。" />

      <SrcBlock of="BodyText">
      <RuleTitle en="BodyText">A · 正文段落（单栏 / 多栏）</RuleTitle>
      <DemoTag>BodyText · columns=2 多栏流式，支持 **行内加粗**</DemoTag>
      <BodyText
        columns={2}
        text="LNP 由可电离脂质、辅助脂质、胆固醇与 PEG-脂质四组分自组装而成。**可电离脂质**决定 pH 依赖的电荷转换行为，是包封与内体逃逸的关键；**PEG-脂质**影响粒径与稳定性，但过量会降低细胞摄取。工艺放大的核心是保持各组分摩尔比、水相/有机相流速比与混合速度的可控性。"
      />
      <BodyText
        columns={2}
        text="从研发批到工程批，**关键质量属性（CQA）不因规模变化而漂移**是放大的唯一判据。因此工艺开发阶段就要把**关键工艺参数（CPP）**与 CQA 的关联量化：混合时间、总流速、N/P 比逐项做单因素与交互作用考察，再以设计空间（Design Space）的形式固化。**多栏正文只用于无小标题的连续论述**；一旦需要分点，必须换成下方列表——靠手动换行去凑分点是反模式。"
      />

      </SrcBlock>
      <SrcBlock of="BulletList">
      <RuleTitle en="BulletList">B · 圆点列表（并列、无先后）</RuleTitle>
      <DemoTag>BulletList · columns=2，圆点为主题色</DemoTag>
      <BulletList
        columns={2}
        items={[
          '**包封率 ≥ 90%**：RiboGreen 法测定游离 mRNA',
          '**粒径 80–120 nm**：PDI ≤ 0.20（DLS）',
          '**Zeta 电位**：中性至微负，避免非特异吸附',
          '**mRNA 完整性**：毛细管电泳 RIN ≥ 8',
          '**残留溶剂**：乙醇 ≤ 0.5%，符合 ICH Q3C',
          '**无菌与内毒素**：≤ 0.5 EU/mL',
          '**加速稳定性**：25 °C / 60% RH 放置 6 个月',
          '**冻融耐受**：−80 °C ↔ 室温 3 次循环不聚集',
        ]}
      />

      </SrcBlock>
      <SrcBlock of="NumberedList">
      <RuleTitle en="NumberedList">C · 数字列表（并列、有先后）</RuleTitle>
      <DemoTag>NumberedList · 主题色等宽数字右对齐成列，第 10 项不会把文字推歪</DemoTag>
      <NumberedList
        columns={2}
        items={[
          '序列优化与 UTR 筛选',
          'IVT 条件与加帽效率确认',
          '脂质配方与 N/P 比筛选',
          '微流控混合参数锁定',
          '放大批制备与工艺等效性比对',
          '稳定性与放行检测',
        ]}
      />
      <NoteBand tone="line" icon="shield" label="用哪个列表"
        text="有先后顺序用**数字**，纯并列用**圆点**。两者混用会让读者误判步骤顺序。" />
      </SrcBlock>
    </Page>
  )
}

/* ============ P3 · 文本层 B ============ */
function Page3() {
  return (
    <Page number={3} folioSide="right">
      <PairTitle cn="文本层 B · 定义、提示与注解" eyebrow={['P3', '文本层']} />

      <SrcBlock of="DefinitionList">
      <RuleTitle en="DefinitionList">A · 术语定义（无表头，纯阅读块）</RuleTitle>
      <DemoTag>DefinitionList · 左术语粗 + 右释义，行间 0.4pt 细线</DemoTag>
      <DefinitionList
        termWidth="26mm"
        items={[
          { term: 'N/P 比', def: '可电离脂质氮原子与 mRNA 磷酸基团的摩尔比，直接决定复合效率与表面电荷。' },
          { term: 'TU', def: '指病毒转染滴度。细胞数量统一用 cells 表示，二者不可混用。' },
        ]}
      />

      </SrcBlock>
      <SrcBlock of="NoteBand">
      <RuleTitle en="NoteBand">B · 提示带（三档 tone）</RuleTitle>
      <DemoTag>NoteBand · tone=&quot;tint&quot; / &quot;line&quot; / &quot;solid&quot;</DemoTag>
      <NoteBand icon="shield" label="适用范围" text="本服务仅供科研用途，不用于人体或临床诊断。" />
      <NoteBand tone="line" text="交付周期自收到合格质粒起算；定制序列需额外 5 个工作日进行密码子优化。" />
      <NoteBand tone="solid" icon="award" text="所有放行数据均附原始图谱与审计追踪，可直接用于 IND 申报资料。" />

      </SrcBlock>
      <SrcBlock of="AnnotationPair">
      <RuleTitle en="AnnotationPair">C · 中英对照注解（不并排，分行）</RuleTitle>
      <DemoTag>AnnotationPair · 上中文 9pt + 下英文 7.5pt 浅灰</DemoTag>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm 6mm' }}>
        <AnnotationPair cn="递送效率" en="Delivery Efficiency" />
        <AnnotationPair cn="内体逃逸" en="Endosomal Escape" />
        <AnnotationPair cn="组织特异性" en="Tissue Specificity" />
        <AnnotationPair cn="表达持续时间" en="Expression Duration" />
      </div>

      </SrcBlock>
      <SrcBlock of="FigCaption">
      <RuleTitle en="FigCaption / Footnotes">D · 图注 与 脚注</RuleTitle>
      <DemoTag>FigCaption · tone=&quot;strong&quot; 右下加粗（表达结论）/ &quot;soft&quot; 居中浅灰（纯描述）</DemoTag>
      <FigCaption>图 1  四项关键质量属性的实测结果（示例数据）</FigCaption>
      <FigCaption tone="soft">图 2  同一组数据的描述性图注，位置与字重都更弱</FigCaption>
      <Footnotes items={['本页所有数值为示例，实际交付以检测报告为准。']} />
      </SrcBlock>
    </Page>
  )
}

/* ============ P4 · 表格层 ============ */
function Page4() {
  return (
    <Page number={4} folioSide="right">
      <PairTitle cn="表格层 · 六种表语体" eyebrow={['P4', '表格层']} />
      <BodyText size="sm" text="表格最容易做错的地方不是样式，而是**选错语体**：营销参数表要「实底反白」，技术数据表要「浅底细线」，选型表要「行标签在左」。三者混用，页面立刻失去专业感。" />

      <SrcBlock of="RowLabelMatrixTable">
      <RuleTitle en="RowLabelMatrixTable">A · 行标签矩阵表（选型场景）</RuleTitle>
      <DemoTag>RowLabelMatrixTable · 行=参数，列=产品；列头可挂产品图</DemoTag>
      <RowLabelMatrixTable
        labelHeader="规格项"
        labelWidth="28mm"
        columns={[
          { label: '冻存管形式', sub: 'Storage Tube' },
          { label: '96 孔板形式', sub: '96-well Plate' },
        ]}
        rows={[
          { label: '包装规格', cells: ['30 / 50 / 100 µL 常规，可定制 ≤500 µL', '30 / 50 / 100 µL 常规，可定制 ≤100 µL'] },
          { label: '密封方式', cells: ['旋盖式密封', '热封膜密封'] },
          { label: '溶液浓度', cells: [{ v: '10 mM（DMSO）/ 2 mM（水相）', highlight: true }, { v: '10 mM（DMSO）', highlight: true }] },
          { label: '建议保存', cells: ['粉末 −20 ℃ 3 年；溶液 −80 ℃ 2 年', '粉末 −20 ℃ 3 年；溶液 −80 ℃ 2 年'] },
          { label: '随货资料', cells: ['靶点、通路、生物活性、SMILES', '靶点、通路、生物活性、SMILES'] },
          { label: '排布方式', cells: ['按板位图排布，空缺孔位可选', '按板位图排布，空缺孔位可选'] },
        ]}
      />
      <Footnotes items={['本表为示例结构，用于演示「行标签在左、参数在上」的选型读法。']} />

      </SrcBlock>
      <SrcBlock of="MethodTable">
      <RuleTitle en="MethodTable">B · 方法对照表（技术 / 知识导向）</RuleTitle>
      <DemoTag>MethodTable · 左列中文名 + 英文缩写分行，右列用途</DemoTag>
      <MethodTable
        nameWidth="42mm"
        caption="表 1  LNP 关键质量属性常用检测方法"
        rows={[
          { name: 'RiboGreen 荧光法', en: 'RiboGreen Assay', desc: '测定游离 mRNA 与总 mRNA，计算**包封率**；灵敏度高、通量友好。' },
          { name: '动态光散射', en: 'DLS', desc: '测定粒径分布与 PDI，评估批次一致性与**聚集倾向**。' },
          { name: '毛细管电泳', en: 'CE', desc: '评估 mRNA 完整性，给出 RIN 值，识别**降解片段**。' },
        ]}
      />

      </SrcBlock>
      <SrcBlock of="KeyValueTable">
      <RuleTitle en="KeyValueTable">C · 键值属性表（产品属性栏）</RuleTitle>
      <DemoTag>KeyValueTable · 无表头两列纵排，左键 tint 底</DemoTag>
      <KeyValueTable
        labelWidth="28mm"
        items={[
          { k: '服务模式', v: 'CRO / CDMO 双模式，可分段承接' },
          { k: '交付形式', v: '无菌过滤液 + 检测报告 + 原始图谱' },
        ]}
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P5 · 卡片层 ============ */
function Page5() {
  return (
    <Page number={5} folioSide="right">
      <PairTitle cn="卡片层 · 产品卡 / 指标条 / 目录" eyebrow={['P5', '卡片层']} />

      <SrcBlock of="ProductCardGrid">
      <RuleTitle en="ProductCardGrid">A · 产品卡网格（产品明细页主力）</RuleTitle>
      <DemoTag>ProductCardGrid · palette=&quot;tone&quot;（默认，同色相多档，守 R1）</DemoTag>
      <ProductCardGrid
        columns={3}
        items={[
          { category: 'mRNA 合成', code: 'YT-1001', name: 'CleanCap AG 共转录加帽', desc: '适用于**治疗级 mRNA** 的一步法加帽工艺，加帽效率 ≥ 95%。' },
          { category: 'mRNA 合成', code: 'YT-1002', name: 'N1-甲基假尿苷修饰', desc: '降低**先天免疫激活**，提升翻译效率与体内半衰期。' },
          { category: 'LNP 包封', code: 'YT-2001', name: '微流控混合包封', desc: '四组分自组装，粒径 **80–120 nm**，PDI ≤ 0.20。' },
          { category: 'LNP 包封', code: 'YT-2002', name: '靶向 LNP 定制', desc: '抗体偶联实现**细胞特异性递送**，支持体内 CAR-T 场景。' },
          { category: '质量放行', code: 'YT-3001', name: '包封率与完整性', desc: 'RiboGreen + CE 双法交叉验证，附**原始图谱**。' },
          { category: '质量放行', code: 'YT-3002', name: '脂质组分定量', desc: 'LC-MS 定量四种脂质摩尔比，验证**配方保真度**。' },
        ]}
      />

      </SrcBlock>
      <SrcBlock of="MetricStrip">
      <RuleTitle en="MetricStrip">B · 大数字指标条（数字前置）</RuleTitle>
      <DemoTag>MetricStrip · 纯数字 + 细线框；与 StatCardRow（带图标卖点卡）分工</DemoTag>
      <MetricStrip
        items={[
          { value: '≥ 95', unit: '%', label: '加帽效率', en: 'Capping Efficiency' },
          { value: '80–120', unit: 'nm', label: '粒径范围' },
          { value: '≤ 0.20', label: 'PDI 分散度' },
          { value: '≥ 8.0', label: 'mRNA 完整性 RIN' },
        ]}
      />

      </SrcBlock>
      <SrcBlock of="TocList">
      <RuleTitle en="TocList">C · 目录条目（20 页以上手册必备）</RuleTitle>
      <DemoTag>TocList · 点线用 dotted 边框，不用重复字符（防 PDF 导出时锯齿）</DemoTag>
      <TocList
        columns={2}
        items={[
          { no: '01', title: '服务平台总览', en: 'Platform Overview', page: '03' },
          { no: '02', title: 'mRNA 合成工艺', en: 'mRNA Synthesis', page: '07' },
          { no: '03', title: 'LNP 包封工艺', en: 'LNP Encapsulation', page: '12' },
          { no: '04', title: '质量控制体系', en: 'Quality Control', page: '17' },
          { no: '05', title: '方法学验证', en: 'Method Validation', page: '23' },
          { no: '06', title: '交付与联系', en: 'Delivery & Contact', page: '28' },
        ]}
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P6 · 拓扑层 A ============ */
function Page6() {
  return (
    <Page number={6} folioSide="right">
      <PairTitle cn="图形层 · 拓扑 A：有先后 / 有相加" eyebrow={['P6', '拓扑层']} />
      <BodyText size="sm" text="R14「一站一拓扑」：**同一种语义永远用同一种拓扑**。本页两种拓扑都表达序列，但一个是「分几步」（有先后），一个是「必须同时满足」（无先后）。" />

      <SrcBlock of="NumberedStepFlow">
      <RuleTitle en="NumberedStepFlow">A · 编号步骤流（分几步）</RuleTitle>
      <DemoTag>NumberedStepFlow · 大圈号骑盒顶 + 描边盒 + 步间箭头</DemoTag>
      <NumberedStepFlow
        size="sm"
        steps={[
          { title: '序列设计', en: 'Design', desc: '密码子优化' },
          { title: 'IVT 合成', en: 'Synthesis', desc: '共转录加帽' },
          { title: '微流控包封', en: 'Encapsulation', desc: 'N/P 比锁定' },
          { title: '切向流纯化', en: 'Purification', desc: '去除游离 mRNA' },
          { title: '质量放行', en: 'Release', desc: '四项关键指标' },
          { title: '制剂交付', en: 'Delivery', desc: '无菌过滤' },
        ]}
        caption="图 3  mRNA-LNP 六步制备流程（示例）"
      />

      </SrcBlock>
      <SrcBlock of="HexChain">
      <RuleTitle en="HexChain">B · 六边形图标链（相加关系）</RuleTitle>
      <DemoTag>HexChain · ⊕ 连接符 = 并列条件，缺一不可</DemoTag>
      <HexChain
        size={16}
        items={[
          { icon: 'dna', label: '目标序列', en: 'Sequence' },
          { icon: 'flask', label: '修饰核苷', en: 'Modification' },
          { icon: 'box', label: '脂质配方', en: 'Formulation' },
          { icon: 'gear', label: '工艺参数', en: 'Process' },
          { icon: 'chart', label: '质控标准', en: 'Spec' },
          { icon: 'check', label: '交付确认', en: 'Confirmed' },
        ]}
        caption="图 4  定制 LNP 服务需要同时确认的六项条件"
      />

      </SrcBlock>
      <SrcBlock of="BeadChain">
      <RuleTitle en="BeadChain">C · 珠链（实验动作序列）</RuleTitle>
      <DemoTag>BeadChain · 圆珠骑在浅色轨道上，标签在珠内</DemoTag>
      <BeadChain
        steps={[
          { label: '实验设计' }, { label: '初筛' }, { label: '数据分析' },
          { label: '复筛' }, { label: '候选确认' },
        ]}
        caption="图 5  筛选类服务的方法学流程"
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P7 · 拓扑层 B ============ */
function Page7() {
  return (
    <Page number={7} folioSide="right">
      <PairTitle cn="图形层 · 拓扑 B：闭环 / 阶段" eyebrow={['P7', '拓扑层']} size="sm" />

      <SrcBlock of="AnnotatedCycle">
      <RuleTitle en="AnnotatedCycle">A · 标注环形流程（闭环迭代）</RuleTitle>
      <DemoTag>AnnotatedCycle · N 节点沿圆周 + 顺时针弧箭头 + 中心标签</DemoTag>
      <AnnotatedCycle
        radius={34}
        nodeWidth="28mm"
        center={{ label: '工艺', sub: '迭代闭环' }}
        nodes={[
          { label: '设计', sub: 'Design' },
          { label: '构建', sub: 'Build' },
          { label: '表达', sub: 'Express' },
          { label: '纯化', sub: 'Purify' },
          { label: '检测', sub: 'Assay' },
          { label: '放行', sub: 'Release' },
          { label: '反馈优化', sub: 'Feedback' },
        ]}
        caption="图 6  工艺开发闭环（每轮迭代产出一组可比数据）"
      />

      </SrcBlock>
      <SrcBlock of="PhaseBand">
      <RuleTitle en="PhaseBand">B · 阶段带（处在时间轴哪一段）</RuleTitle>
      <DemoTag>PhaseBand · 多段色带 + 上方括注归档 + 细横轴；active 高亮本服务覆盖段</DemoTag>
      <PhaseBand
        stages={['靶点选择', '苗头识别', '先导优化', '临床前', '临床 I', '临床 II', '上市']}
        phases={[{ label: '早期药物发现', span: 3 }, { label: '药物开发', span: 4 }]}
        active={[2, 3, 4]}
        caption="图 7  本平台服务覆盖第 3–5 段"
      />

      </SrcBlock>
    </Page>
  )
}

/* ============ P8 · 拓扑层 C ============ */
function Page8() {
  return (
    <Page number={8} folioSide="right">
      <PairTitle cn="图形层 · 拓扑 C：服务网络图" eyebrow={['P8', '拓扑层']} size="sm" />
      <BodyText size="sm" text="链、环、珠链都只能表达「一条路径」。当画面要同时说明**多个入口、一个中枢、多条出口**时，必须换成网络图——这是第 6 种拓扑。" />

      <SrcBlock of="ServiceNetworkMap">
      <RuleTitle en="ServiceNetworkMap">服务网络图（多入口汇聚，再分出）</RuleTitle>
      <DemoTag>ServiceNetworkMap · 网格落位 + 箭头挂节点边缘；注解块与节点共处同一网格</DemoTag>
      <ServiceNetworkMap
        columns={3}
        nodes={[
          { col: 1, row: 1, label: '质粒模板与序列优化', en: 'Template & sequence design', arrow: 'down' },
          { col: 2, row: 1, label: 'mRNA 原液制备', en: 'mRNA drug substance', arrow: 'down' },
          { col: 3, row: 1, label: '脂质组分与配方', en: 'Lipid components', arrow: 'down' },
          { col: 1, row: 2, span: 3, label: 'LNP 配方设计与工艺开发', en: 'Formulation design & process development', tone: 'deep', arrow: 'down' },
          { col: 1, row: 3, label: '制剂放大与工艺锁定', en: 'Scale-up & process lock' },
          { col: 2, row: 3, label: '质量控制与方法学验证', en: 'QC & method validation' },
          { col: 3, row: 3, label: '稳定性与放行检测', en: 'Stability & release testing' },
        ]}
        captions={[
          { col: 1, row: 4, cn: '交付：工艺参数包、批记录模板', en: 'Process parameter package' },
          { col: 2, row: 4, cn: '交付：质量标准、方法验证报告', en: 'Specification & validation report' },
          { col: 3, row: 4, cn: '交付：稳定性方案、检测报告', en: 'Stability protocol & assay report' },
        ]}
        caption="图 8  三个入口汇聚到一个中枢、再分出三条服务线——链与环都表达不了这种结构"
      />
      <NoteBand icon="gear" label="为什么箭头不画成两点连线"
        text="连线位置依赖实测坐标，换个字长就会错位。本组件改用**网格落位**：节点声明 col/row，箭头只挂在自身右缘或下缘——因此加一个节点、改一句文案，版面都不会散。**配比纪律**：入口数、出口数不必相等，但中枢必须独占一整行并跨满列数，否则「汇聚」的语义就看不出来。" />
      <Footnotes items={['图 8 为示例结构；真实服务网络请按业务口径补充节点所对应的交付物。']} />

      </SrcBlock>
      <SrcBlock of="KeyValueTable">
      <RuleTitle en="KeyValueTable">B · 六种拓扑的选择速查</RuleTitle>
      <DemoTag />
      <KeyValueTable
        size="8pt"
        labelWidth="46mm"
        items={[
          { k: '有先后、分几步', v: '**NumberedStepFlow** 编号步骤流（圆编号 + 描边盒）' },
          { k: 'A 且 B，无先后', v: '**HexChain** 六边形相加链（用 ⊕ 而非 ›）' },
          { k: '我们是怎么做的', v: '**BeadChain** 实验动作链（带质感、亲和）' },
          { k: '迭代、回到起点', v: '**AnnotatedCycle** 标注环形流程（弧箭头顺时针）' },
          { k: '多入口汇聚再分出', v: '**ServiceNetworkMap** 服务网络图（网格落位）' },
          { k: '处在时间轴哪一段', v: '**PhaseBand** 阶段带（分段 + 归档 + active 高亮）' },
        ]}
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P9 · 图表层 A ============ */
function Page9() {
  return (
    <Page number={9} folioSide="right">
      <PairTitle cn="图形层 · 图表 A：小倍数与构成" eyebrow={['P10', '图表层']} size="sm" />

      <SrcBlock of="PanelBarChart">
      <RuleTitle en="PanelBarChart">A · 多面板参数条形图（小倍数）</RuleTitle>
      <DemoTag>PanelBarChart · 竖基线 + 顶部刻度 + 左类别；sharedScale 让四面板可比</DemoTag>
      <PanelBarChart
        columns={2}
        ticks={4}
        labelWidth="14mm"
        sharedScale
        panels={[
          { title: '粒径分布（nm）', items: [{ label: '60–80', value: 18 }, { label: '80–100', value: 62 }, { label: '100–120', value: 44 }, { label: '120+', value: 9 }] },
          { title: 'PDI 分布', items: [{ label: '< 0.10', value: 34 }, { label: '0.10–0.15', value: 51 }, { label: '0.15–0.20', value: 27 }, { label: '> 0.20', value: 6 }] },
          { title: '包封率（%）', items: [{ label: '< 80', value: 4 }, { label: '80–85', value: 12 }, { label: '85–90', value: 38 }, { label: '≥ 90', value: 74 }] },
          { title: 'mRNA 完整性 RIN', items: [{ label: '< 7', value: 5 }, { label: '7–8', value: 21 }, { label: '8–9', value: 58 }, { label: '≥ 9', value: 33 }] },
        ]}
        caption="图 9  批次质量参数分布（示例数据；四面板共享刻度，横向比较才成立）"
      />
      <NoteBand tone="line" icon="chart" label="小倍数图为什么必须共享刻度"
        text="四个面板若各自缩放到「好看」的高度，「包封率 ≥ 90% 有 74 批」和「粒径 80–100 nm 有 62 批」会画得一样高，读者得出相反结论。**sharedScale 打开后四面板共用同一最大值**，条长才可比——这是小倍数图的成立前提，不是可选美化。" />

      </SrcBlock>
      <SrcBlock of="AnnotatedDonut">
      <RuleTitle en="AnnotatedDonut">B · 注释甜甜圈（构成 + 逐块解释）</RuleTitle>
      <DemoTag>AnnotatedDonut · 注解块标题色 == 扇区色（「类目色恒定」的实证）</DemoTag>
      <AnnotatedDonut
        size={48}
        thickness={17}
        center={{ label: '产品线', sub: '2026' }}
        segments={[
          { side: 'left', label: 'mRNA 合成', points: ['加帽效率 ≥ 95%', '修饰核苷可选'] },
          { side: 'left', label: 'LNP 包封', points: ['粒径 80–120 nm', '靶向 LNP 定制'] },
          { side: 'right', label: '质量放行', points: ['四项关键质量属性', '附原始图谱'] },
          { side: 'right', label: '方法学验证', points: ['专属性 / 精密度', '线性与范围'] },
        ]}
        caption="图 10  四条产品线的构成与交付要点"
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P10 · 图表层 B ============ */
function Page10() {
  return (
    <Page number={10} folioSide="right">
      <PairTitle cn="图形层 · 图表 B：分布形态即信息" eyebrow={['P10', '图表层']} size="sm" />

      <SrcBlock of="ScatterClusterPanel">
      <RuleTitle en="ScatterClusterPanel">A · 散点聚类面板</RuleTitle>
      <DemoTag>ScatterClusterPanel · 确定性种子生成，PDF 与预览逐点为同一结果</DemoTag>
      <ScatterClusterPanel
        height={38}
        caption="图 11  候选分子的性质分布（示例数据；形状本身就是信息，故不能用条形图替代）"
      />
      <SwatchLegend
        items={[
          { label: '组 1', color: '#8FA9D8' }, { label: '组 2', color: '#8FC9D0' },
          { label: '组 3', color: '#D8A0B4' }, { label: '组 4', color: '#C8C08F' },
        ]}
      />

      </SrcBlock>
      <SrcBlock of="ScatterClusterPanel">
      <RuleTitle en="ScatterClusterPanel · palette=&quot;tone&quot;">B · 同一组件、两种配色纪律</RuleTitle>
      <DemoTag>palette=&quot;tone&quot; · 同色相多档（R22 默认）—— 类目本身无强弱时用它</DemoTag>
      <ScatterClusterPanel
        height={30}
        palette="tone"
        seed={11}
        caption="图 12  同色相多档：只表达「有多少个簇」，不暗示簇之间有质的差别"
      />
      <NoteBand icon="check" label="R22 · 类目色纪律"
        text="跨色相（palette=&quot;category&quot;）必须**显式声明**，且同一类目在全册任何页保持同一色。默认走同色相多档——一页出现 5 个不同色相，是最典型的 AI slop 特征。" />
      <Footnotes items={['本页散点由固定种子生成，属演示数据；真实项目请传入实测坐标。']} />
      </SrcBlock>
    </Page>
  )
}

/* ============ P11 · 图解层 + 家具层 ============ */
function Page11() {
  return (
    <Page number={11} folioSide="right">
      <SrcBlock of="BrandHeaderBar">
      <BrandHeaderBar
        brand="YUANTAI BIO"
        tagline="mRNA-LNP 一站式技术服务平台"
        meta="www.yuantai-bio.com   ·   400-XXX-XXXX"
      />
      </SrcBlock>
      <PairTitle cn="图解层 与 家具层" eyebrow={['P11', '图解 / 家具']} size="sm" />

      <SrcBlock of="FigurePanel">
      <RuleTitle en="FigurePanel">A · 图面板（所有图的统一外壳）</RuleTitle>
      <DemoTag>FigurePanel · tone=&quot;tint&quot; 同色相极浅底 + 细描边，把图形语言统一收口</DemoTag>
      <FigurePanel tone="tint" caption="图 13  一页放多张图时，靠外壳而不是靠各自配色来区分">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4mm' }}>
          <DemoAbstractArt /><DemoAbstractArt /><DemoAbstractArt />
        </div>
      </FigurePanel>

      </SrcBlock>
      <SrcBlock of="LegendFigure">
      <RuleTitle en="LegendFigure">B · 图例插图（插图 + 图例 + 注解）</RuleTitle>
      <DemoTag>LegendFigure · 三栏网格 1fr / auto / 1fr，左右图例长度不等也保持插图居中</DemoTag>
      <LegendFigure
        artHeight="30mm"
        items={[
          { side: 'left', label: '递送效率', en: 'Delivery' },
          { side: 'left', label: '组织特异性', en: 'Specificity' },
          { side: 'right', label: '内体逃逸', en: 'Escape' },
          { side: 'right', label: '表达持续时间', en: 'Duration' },
        ]}
        caption="图 14  靶向 LNP 的四项评价维度"
      >
        <DemoAbstractArt height="30mm" />
      </LegendFigure>

      </SrcBlock>
      <SrcBlock of="SwatchLegend">
      <RuleTitle en="SwatchLegend / ContactFooterBand">C · 色块图例 与 页脚联系带</RuleTitle>
      <DemoTag>SwatchLegend · 横排 / 纵排；未给 color 时按奇偶取主色档</DemoTag>
      <SwatchLegend
        label="图例"
        items={[
          { label: 'GMP 级', color: '#9AA6C4' }, { label: '科研级', color: '#B9C4D8' },
          { label: '定制服务', color: '#D6DCE8' },
        ]}
      />
      <DemoTag>ContactFooterBand · tone=&quot;tint&quot;；整页联系页请用 BackCover</DemoTag>
      <ContactFooterBand
        heading="联系我们"
        items={[
          { type: 'web', text: 'www.yuantai-bio.com' },
          { type: 'phone', text: '400-XXX-XXXX' },
          { type: 'mail', text: 'service@yuantai-bio.com' },
          { type: 'addr', text: '湖南·长沙' },
        ]}
      />
      </SrcBlock>
    </Page>
  )
}

/* ============ P12 · 分类总表 ============ */
function Page12() {
  return (
    <Page number={12} folioSide="left">
      <PairTitle cn="组件分类总表" eyebrow={['P12', '分类法']} size="sm" />
      <BodyText size="sm" text="分类轴不是「文件在哪」，而是**「页面上的哪个位置」**——因为装配一页时的思考顺序就是从上到下、从外到内。完整版见 references/taxonomy.md。" />
      <SrcBlock of="RowLabelMatrixTable">
      <RowLabelMatrixTable
        labelHeader="页面槽位"
        labelWidth="26mm"
        fontSize="7pt"
        columns={[{ label: '可用组件（× 为本次新增）' }, { label: '选型要点' }]}
        rows={[
          { label: '1 骨架', cells: ['Cover · SectionDivider · Page · BackCover · Folio', '深底只属于封面 / 章节页 / 封底（R2）'] },
          { label: '2 家具 ×', cells: ['BrandHeaderBar × · ContactFooterBand × · Icon', '每页可重复；只用主色 + 灰阶'] },
          { label: '3 标题 ×', cells: ['H1 择一：PillTitle · BlockTitle × · OutlineTitle × · PairTitle × · NumberedTitle ×　H2 级可多次：BarTitle × · RuleTitle × · H2 · EyebrowTitle ×', '收口用胶囊，并列用方块，双语用中英对照；一页标题形态不宜超过 3 种'] },
          { label: '4 文本 ×', cells: ['BodyText × · BulletList × · NumberedList × · DefinitionList × · NoteBand × · AnnotationPair × · FigCaption × · Lead · Footnotes', '唯一高亮手段 = 行内加粗（renderRich）'] },
          { label: '5 表格 ×', cells: ['营销：SpecTable · TierMatrixTable　技术：InstrumentReportPanel · MethodTable ×　选型：RowLabelMatrixTable ×　属性：KeyValueTable ×', '按页型选语体，绝不混用'] },
          { label: '6 卡片 ×', cells: ['StatCardRow · TierCards · TestimonialCard · ConclusionBanner · ProductCardGrid × · MetricStrip × · TocList ×', '数字用 MetricStrip，卖点用 StatCardRow'] },
          { label: '7 图形（拓扑）×', cells: ['FlowChain · IconFlowBar · ChevronFlow · TimelineBar · StagePipelineChain · FunnelStages · CycleFlowDiagram · ComboEquationDiagram · NumberedStepFlow × · HexChain × · BeadChain × · AnnotatedCycle × · ServiceNetworkMap × · PhaseBand ×', '一站一拓扑（R14）：同语义不复用同拓扑'] },
          { label: '7 图形（图表 / 图解）×', cells: ['图表：DataChart · TargetBarChart · PanelBarChart × · AnnotatedDonut × · ScatterClusterPanel ×　图解：FigurePanel × · LegendFigure × · SwatchLegend × · InstrumentReportPanel · EvidenceGrid · CitationBlock · CaseBlock', '图表默认单色；类目色默认同色相（R22）'] },
          { label: '8 标签', cells: ['CategoryTagRow · ChipPillGrid · IconFeatureList', '同色系自配：浅底 + 同色相深一阶字'] },
        ]}
      />
      </SrcBlock>
      <NoteBand tone="tint" icon="check" label="本版新增" text="34 个新组件，覆盖标题形态、文本块、选型表格、产品卡、6 种拓扑、3 种图表、图解装框与页眉页脚。组件总数 **37 → 71**，族 **10 → 14**。" />
      <Footnotes items={[
        '族编号跳过「族 L」：L 已被版式原型占用，为保持命名空间互不冲突而跳过。',
        '× 标记表示 v0.4 新增。本页所有数据为示例，用于验收组件而非陈述业务事实。',
        'v0.5 起：每个演示块按它自己的**来源脉**取色（GenScript 三册 / MCE 五册），见块内徽标；标「锁定」的组件由契约钉在具体一册，不随下拉变化（R23）。',
      ]} />
    </Page>
  )
}

export function AppTaxonomy() {
  // 配色状态放进 URL（?mode=brand&gs=red&mce=mce-qms&brand=yuantai）——
  // 这样"某个配色下的陈列"是一个可分享、可复现的地址，而不是只在某个人浏览器里的临时状态。
  const q = new URLSearchParams(window.location.search)
  const [cfg, setCfg] = useState({
    mode: q.get('mode') === 'brand' ? 'brand' : 'source',
    brand: THEMES[q.get('brand')] ? q.get('brand') : 'yuantai',
    pick: {
      genscript: THEMES[q.get('gs')] ? q.get('gs') : defaultManualOf('genscript'),
      mce: THEMES[q.get('mce')] ? q.get('mce') : defaultManualOf('mce'),
    },
  })

  const update = (next) => {
    setCfg(next)
    const p = new URLSearchParams(window.location.search)
    p.set('gs', next.pick.genscript)
    p.set('mce', next.pick.mce)
    if (next.mode === 'brand') { p.set('mode', 'brand'); p.set('brand', next.brand) }
    else { p.delete('mode'); p.delete('brand') }
    window.history.replaceState(null, '', '?' + p.toString())
  }

  const tab = (on) => ({
    marginRight: '2mm', padding: '1.5mm 4mm', borderRadius: '999px', cursor: 'pointer',
    border: '1px solid #666', fontSize: '10pt',
    background: on ? '#111' : '#fff', color: on ? '#fff' : '#333',
  })
  const sel = {
    marginRight: '3mm', padding: '1.2mm 2mm', fontSize: '10pt',
    borderRadius: '1mm', border: '1px solid #666', background: '#fff',
  }
  const lab = { marginRight: '1.5mm', opacity: 0.75 }

  return (
    <div className="bds-demo-wrap" style={{ background: '#8a8a8a', paddingBottom: '20mm' }}>
      <div className="bds-switchbar">
        <span style={{ marginRight: '3mm', opacity: 0.75 }}>配色：</span>
        <button style={tab(cfg.mode === 'source')} onClick={() => update({ ...cfg, mode: 'source' })}>来源模式</button>
        <button style={tab(cfg.mode === 'brand')} onClick={() => update({ ...cfg, mode: 'brand' })}>品牌模式</button>

        {cfg.mode === 'source' ? (
          <>
            <span style={lab}>{CORPORA.genscript.label}</span>
            <select style={sel} value={cfg.pick.genscript}
              onChange={(e) => update({ ...cfg, pick: { ...cfg.pick, genscript: e.target.value } })}>
              {CORPORA.genscript.manuals.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <span style={lab}>{CORPORA.mce.label}</span>
            <select style={sel} value={cfg.pick.mce}
              onChange={(e) => update({ ...cfg, pick: { ...cfg.pick, mce: e.target.value } })}>
              {CORPORA.mce.manuals.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
            <span className="hint">
              每个演示块按自己的来源脉取色（R23）；标「锁定」的组件已由契约钉在某一册，不随下拉变化
            </span>
          </>
        ) : (
          <>
            <select style={sel} value={cfg.brand} onChange={(e) => update({ ...cfg, brand: e.target.value })}>
              {BRAND_KEYS.map(k => <option key={k} value={k}>{THEMES[k].name}（{k}）</option>)}
            </select>
            <span className="hint">全册统一换肤 · 成稿视角，与来源无关 —— 锁定的组件在这里也会跟随</span>
          </>
        )}
      </div>
      <AtlasCtx.Provider value={cfg}>
        <ThemeProvider theme={cfg.mode === 'brand' ? cfg.brand : cfg.pick.genscript}>
          <Cover
            title={<>mRNA-LNP<br />技术服务手册</>}
            enTitle={<>组件陈列版 · v0.5<br />71 个组件 · 14 族 · 按来源脉配色</>}
            logo={<div style={{ fontSize: '17pt', fontWeight: 800, letterSpacing: '0.5px' }}>YUANTAI BIO</div>}
          />
          <Page1 /><Page2 /><Page3 /><Page4 /><Page5 /><Page6 />
          <Page7 /><Page8 /><Page9 /><Page10 /><Page11 /><Page12 />
        </ThemeProvider>
      </AtlasCtx.Provider>
    </div>
  )
}
