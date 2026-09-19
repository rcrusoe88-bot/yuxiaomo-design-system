// 颜色工具 —— 让组件从主题令牌派生浅色系，从而不必在组件里写死 hex（硬约束 R4）
export function hexToRgb(hex) {
  const h = String(hex).replace('#', '')
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(v, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const rgbToHex = (rgb) =>
  '#' + rgb.map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('').toUpperCase()

export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0, s = 0
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return [h * 360, s * 100, l * 100]
}

export function hslToRgb([h, s, l]) {
  const hh = (((h % 360) + 360) % 360) / 360
  s /= 100; l /= 100
  if (!s) { const v = l * 255; return [v, v, v] }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const f = (t) => {
    let x = t
    if (x < 0) x += 1
    if (x > 1) x -= 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }
  return [f(hh + 1 / 3) * 255, f(hh) * 255, f(hh - 1 / 3) * 255]
}

// 色相偏移
export const shiftHue = (hex, deg) => {
  const [h, s, l] = rgbToHsl(hexToRgb(hex))
  return rgbToHex(hslToRgb([h + deg, s, l]))
}

// 与白色混合（amt 0~1，越大越浅）
export const mixWhite = (hex, amt) => {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt])
}

// 与黑色混合
export const mixBlack = (hex, amt) => {
  const [r, g, b] = hexToRgb(hex)
  return rgbToHex([r * (1 - amt), g * (1 - amt), b * (1 - amt)])
}

// 从主题主色派生 n 组浅色标签色，返回 [{ bg 浅底, fg 同色相深字, base 中调 }]
//
// spread = 1（默认）→ 色相按 HUE_OFFSETS 错开，得到"跨色相"的类目色轮转。
//   仅用于确需区分类目的场合（R22 要求调用方显式声明 palette="category"）。
// spread = 0 → 锁死色相，改用**明度分阶**拉开层次，得到"同色相多档"。
//   这是本系统的默认纪律（R1 一册一色相 / R22 类目色恒定），
//   因为一页里出现 5 个不同色相，是最典型的 AI slop 视觉特征。
const HUE_OFFSETS = [0, 30, -26, 58, -54, 88, -84, 116]
export function pastelRamp(baseHex, n, { spread = 1, sat = 52, light = 50 } = {}) {
  const [h0] = rgbToHsl(hexToRgb(baseHex))
  const count = Math.max(n, 1)
  return Array.from({ length: count }, (_, i) => {
    const round = Math.floor(i / HUE_OFFSETS.length)
    const h = spread ? h0 + HUE_OFFSETS[i % HUE_OFFSETS.length] * spread + round * 14 : h0
    // 同色相模式：base 明度从 light+16 线性降到 light-9.6，保证相邻档仍可分辨
    const step = 32 / count
    return {
      bg: rgbToHex(hslToRgb([h, 34, spread ? 90 : Math.min(94, 87 + (i % 3) * 3)])),
      fg: rgbToHex(hslToRgb([h, 44, spread ? 33 : Math.max(26, 42 - (i % count) * (12 / count))])),
      base: rgbToHex(hslToRgb([h, spread ? sat : Math.max(34, sat - 14), spread ? light : light + 16 - (i % count) * step])),
    }
  })
}

// 同色相多阶（R22 默认路径的语法糖）：pastelRamp(hex, n, { spread: 0 })
export const toneRamp = (baseHex, n) => pastelRamp(baseHex, n, { spread: 0 })
// 跨色相类目色（须显式声明）：pastelRamp(hex, n, { spread: 1 })
export const categoryRamp = (baseHex, n) => pastelRamp(baseHex, n, { spread: 1 })
