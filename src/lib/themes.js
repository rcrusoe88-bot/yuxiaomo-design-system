// 主题令牌 —— 角色化，源自 GenScript 三册像素实测（设计元素完整清单_GenScript.md 第〇节）
// 角色：functional 功能主色 / header 表头色 / dark 结构深底 / tint 卡片浅底 / zebra 斑马纹
//       capsuleLight+capsuleDeep 胶囊棒装饰两档 / ramp 时间轴递变色带（浅→深）
//       accent / accent2 源色第二色（编号 / 文献 / 图表专用）
//       ⚠ accent 仅作**来源记录**，不由组件自动套用：R1（一册一色相）优先于
//         逐色还原 —— 见 BarTitle 契约「MCE library p8 青色 #58C6CE（本系统改用
//         主题主色以守 R1）」。要显式用第二色时，须自己从 theme.accent 取。
//
// ★ 来源分两条脉（R23「配色随来源，不随默认」的实体依据）
//   genscript  GenScript 金斯瑞 三册 + 蛋白手册抗体章 → blue / red / purple / wine
//   mce        MCE 皓元 五册                          → mce-library / mce-discovery /
//                                                      mce-protac / mce-qms / mce-biochem
//   两条脉各自「结构同构、只换主色」——这是两份逆向清单第〇节的共同结论，
//   也是本库组件能跨册复用而颜色不漂的根据。
//   ⚠ v0.5 之前只实现了 genscript 一条脉：MCE 的 39 个组件无处取色，只能被画成
//     GenScript 的蓝 ——「组件全变蓝」的病根就在这里，不是忘了换主题。
//
//   实测值取自两份清单的「五册实测主色」表；表里没有的角色由主色**派生**，
//   派生规则集中在下方的 derived()，不手工编 hex、也不把派生值伪装成实测值。
// ⚠ 必须写显式扩展名 —— 不带 .js 时 Vite 能解析、Node 不能，
//   而 scripts/registry.mjs 与 scripts/audit.mjs 要直接 import 本文件读来源脉表。
import { mixWhite, mixBlack } from './color.js'

export const NEUTRAL = {
  text: '#4D4D4F',        // 正文灰
  textSoft: '#808080',    // 次级灰（脚注/图例）
  line: '#C8C8C8',        // 表格行线 0.5pt
  ghost: '#C0C0C0',       // 幽灵灰（装饰大字）
  white: '#FFFFFF',
  control: '#E8963C',     // 阳性对照/对比组（图表许可的第二色）
  compare: '#1870B8',     // 对照实验标注蓝
}

// 主色 → 缺失角色。四条规则固定：浅底 7% / 斑马 3.5% / 深档 35% 黑 / 递变 4 阶浅→深。
// 单独抽出来是为了让「哪些是实测、哪些是派生」一眼可辨。
const derived = (functional) => ({
  tint: mixWhite(functional, 0.93),
  zebra: mixWhite(functional, 0.965),
  capsuleDeep: mixBlack(functional, 0.35),
  ramp: [mixWhite(functional, 0.72), mixWhite(functional, 0.42), functional, mixBlack(functional, 0.22)],
})

export const THEMES = {
  /* ================= 来源脉一：GenScript 金斯瑞 三册 ================= */
  // 蓝主题 · 源自《核酸服务手册》
  blue: {
    name: '深海蓝',
    corpus: 'genscript',
    manual: '核酸服务手册',
    functional: '#019EDB',
    header: '#019EDB',
    dark: '#006CB1',
    tint: '#F0FAFD',
    zebra: '#F5FBFD',
    capsuleLight: '#92CEE7',
    capsuleDeep: '#1E3C92',
    ramp: ['#92CEE7', '#4CB6E4', '#019EDB', '#007BB0'],
  },
  // 红主题 · 源自《细胞工程服务手册》
  red: {
    name: '信号红',
    corpus: 'genscript',
    manual: '细胞工程服务手册',
    functional: '#EE3451',
    header: '#F27292',
    dark: '#701E20',
    tint: '#FDF0F2',
    zebra: '#FEF6F7',
    capsuleLight: '#F27292',
    capsuleDeep: '#C3263C',
    ramp: ['#F5A0B4', '#F16982', '#EE3451', '#C3263C'],
  },
  // 紫主题 · 源自《蛋白&抗体服务手册》蛋白章
  purple: {
    name: '学术紫',
    corpus: 'genscript',
    manual: '蛋白&抗体服务手册',
    functional: '#682E79',
    header: '#9664AA',
    dark: '#2C1736',
    tint: '#F2F0F5',
    zebra: '#F2F0F5',
    capsuleLight: '#C797C4',
    capsuleDeep: '#2C1736',
    ramp: ['#C797C4', '#9664AA', '#7850A0', '#682E79'],
  },
  // 酒红主题 · 源自蛋白手册抗体章（深底专用变体）
  wine: {
    name: '酒红',
    corpus: 'genscript',
    manual: '蛋白手册 · 抗体章',
    functional: '#EE3250',
    header: '#F07090',
    dark: '#6F1D1F',
    tint: '#F8E8E8',
    zebra: '#FEF6F7',
    capsuleLight: '#F2829E',
    capsuleDeep: '#6F1D1F',
    ramp: ['#F2829E', '#F06068', '#EE3250', '#B02340'],
  },

  /* ================= 来源脉二：MCE 皓元 五册（v0.5 补齐） ================= */
  // 来源：《设计元素完整清单_MCE.md》第〇节「五册实测主色」表。
  // 该表只列 主色 / 辅助色 / 深底 三档，其余角色走 derived()。
  // 化合物库手册 · 深蓝（92 页，五册主力）
  'mce-library': {
    name: '化合物库深蓝',
    corpus: 'mce',
    manual: '化合物库手册',
    functional: '#2C6BAA',   // 实测 主色
    header: '#2C6BAA',       // 实测
    dark: '#2670B8',         // 实测 深底
    accent: '#F09B40',       // 实测 橙（编号 / 文献专用）
    accent2: '#58C6CE',      // 实测 青绿（图表）
    tint: '#F1F9FD',         // 实测「整表统一浅蓝 #F1F9FD」
    zebra: '#F1F9FD',        // 实测 组带交替底
    capsuleLight: '#B6E6F1', // 实测 递变带浅端（4 段 #5BC7DF→#B6E6F1）
    capsuleDeep: '#2670B8',  // 实测 深底
    ramp: ['#B6E6F1', '#5BC7DF', '#2C6BAA', '#2670B8'], // 实测 4 段递变
  },
  // 药物发现服务 · 紫
  'mce-discovery': {
    name: '药物发现紫',
    corpus: 'mce',
    manual: '药物发现服务',
    functional: '#574DA0',   // 实测 主色
    header: '#6A6AB0',       // 实测 主色（浅档）
    dark: '#030017',         // 实测 近黑紫
    accent: '#DBB356',       // 实测 金（口号）
    accent2: '#FCBB6D',      // 实测 橙（湿实验）
    capsuleLight: '#D3CBE5', // 实测 斜纹光谱带浅端
    ...derived('#574DA0'),
  },
  // PROTAC 手册 · 深紫
  'mce-protac': {
    name: 'PROTAC 深紫',
    corpus: 'mce',
    manual: 'PROTAC 手册',
    functional: '#5A3A7D',   // 实测 主色
    header: '#5A3A7D',       // 实测
    accent: '#DC5973',       // 实测 玫红（类目条）
    accent2: '#C44159',      // 实测
    ...derived('#5A3A7D'),   // dark 亦派生（清单深底栏为「—」）
  },
  // 质量管理体系 · 珊瑚红
  'mce-qms': {
    name: 'QMS 珊瑚红',
    corpus: 'mce',
    manual: '质量管理体系',
    functional: '#F16366',   // 实测 主色
    header: '#F16366',       // 实测
    dark: '#120E0F',         // 实测 近黑
    accent: '#41B3B9',       // 实测 青
    accent2: '#FCBB6D',      // 实测 橙
    capsuleLight: '#C1E7ED', // 实测 胶囊资产（贯穿 p10/p11/p14/p16）
    ...derived('#F16366'),
    zebra: '#EFEFEF',        // 实测 仪器积分表斑马纹（写在 spread 之后：实测优先于派生）
  },
  // 生化试剂 · 青
  'mce-biochem': {
    name: '生化试剂青',
    corpus: 'mce',
    manual: '生化试剂',
    functional: '#2995B3',   // 实测 主色
    header: '#2995B3',       // 实测
    accent: '#F6F5B6',       // 实测 淡黄
    accent2: '#A67AB6',      // 实测 紫
    ...derived('#2995B3'),
  },

  /* ================= 品牌主题（不属于任何来源脉，仅用于成稿换肤） ================= */
  // 远泰红 · 品牌色：主红 #D80000 + 深灰 #606060（手册/LOGO 规范），深底档用深灰代替深色红
  yuantai: {
    name: '远泰红',
    corpus: 'brand',
    manual: '远泰品牌手册',
    functional: '#D80000',
    header: '#D80000',
    dark: '#606060',
    tint: '#FBECEC',
    zebra: '#FCF5F5',
    capsuleLight: '#F2C2C2',
    capsuleDeep: '#404040',
    ramp: ['#F2C2C2', '#D80000', '#A30000', '#606060'],
  },
}

/* 来源脉索引 —— 组件契约里的 `src` 字段指向这里。
   `src` 的取值域 = ORIGIN_KEYS；选型时「脉 → 册」由调用方决定，
   所以组件只声明自己属于哪条脉，不绑定某一册（同脉内换册不换结构）。 */
export const CORPORA = {
  genscript: {
    label: 'GenScript 金斯瑞',
    short: 'GS',
    note: '三册 + 抗体章；结构同构、只换主色',
    manuals: [
      { key: 'blue', label: '核酸服务手册' },
      { key: 'red', label: '细胞工程服务手册' },
      { key: 'purple', label: '蛋白&抗体服务手册' },
      { key: 'wine', label: '蛋白手册 · 抗体章' },
    ],
  },
  mce: {
    label: 'MCE 皓元',
    short: 'MCE',
    note: '五册；结构同构、只换主色',
    manuals: [
      { key: 'mce-library', label: '化合物库手册' },
      { key: 'mce-discovery', label: '药物发现服务' },
      { key: 'mce-protac', label: 'PROTAC 手册' },
      { key: 'mce-qms', label: '质量管理体系' },
      { key: 'mce-biochem', label: '生化试剂' },
    ],
  },
  neutral: {
    label: '中性文本层',
    short: '中性',
    note: '不引入色相，随调用页主题',
    manuals: [],
  },
}

export const ORIGIN_KEYS = Object.keys(CORPORA)
export const BRAND_THEME_KEYS = Object.keys(THEMES)

/** 主题 key → 手册名（徽标用）；找不到时退回主题中文名 */
export const manualLabel = (key) => (THEMES[key] && (THEMES[key].manual || THEMES[key].name)) || key

/** 某条脉的默认册（取第一册：GenScript 核酸蓝 / MCE 化合物库深蓝） */
export const defaultManualOf = (corpus) => {
  const c = CORPORA[corpus]
  return c && c.manuals.length ? c.manuals[0].key : 'blue'
}

export const getTheme = (key) => THEMES[key] || THEMES.blue
