// 主题令牌 —— 角色化，源自 GenScript 三册像素实测（设计元素完整清单_GenScript.md 第〇节）
// 角色：functional 功能主色 / header 表头色 / dark 结构深底 / tint 卡片浅底 / zebra 斑马纹
//       capsuleLight+capsuleDeep 胶囊棒装饰两档 / ramp 时间轴递变色带（浅→深）
export const NEUTRAL = {
  text: '#4D4D4F',        // 正文灰
  textSoft: '#808080',    // 次级灰（脚注/图例）
  line: '#C8C8C8',        // 表格行线 0.5pt
  ghost: '#C0C0C0',       // 幽灵灰（装饰大字）
  white: '#FFFFFF',
  control: '#E8963C',     // 阳性对照/对比组（图表许可的第二色）
  compare: '#1870B8',     // 对照实验标注蓝
}

export const THEMES = {
  // 蓝主题 · 源自《核酸服务手册》
  blue: {
    name: '深海蓝',
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
    functional: '#EE3250',
    header: '#F07090',
    dark: '#6F1D1F',
    tint: '#F8E8E8',
    zebra: '#FEF6F7',
    capsuleLight: '#F2829E',
    capsuleDeep: '#6F1D1F',
    ramp: ['#F2829E', '#F06068', '#EE3250', '#B02340'],
  },
  // 远泰红 · 品牌色：主红 #D80000 + 深灰 #606060（手册/LOGO 规范），深底档用深灰代替深色红
  yuantai: {
    name: '远泰红',
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

export const getTheme = (key) => THEMES[key] || THEMES.blue
