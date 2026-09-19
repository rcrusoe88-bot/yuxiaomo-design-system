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

// 从主题主色派生 n 组浅色标签色（低饱和高亮度，色相均匀错开）
// 返回 [{ bg 浅底, fg 同色相深字, base 中调 }]
const HUE_OFFSETS = [0, 30, -26, 58, -54, 88, -84, 116]
export function pastelRamp(baseHex, n) {
  const [h0] = rgbToHsl(hexToRgb(baseHex))
  return Array.from({ length: Math.max(n, 1) }, (_, i) => {
    const h = h0 + HUE_OFFSETS[i % HUE_OFFSETS.length] + Math.floor(i / HUE_OFFSETS.length) * 14
    return {
      bg: rgbToHex(hslToRgb([h, 34, 90])),
      fg: rgbToHex(hslToRgb([h, 44, 33])),
      base: rgbToHex(hslToRgb([h, 52, 50])),
    }
  })
}
