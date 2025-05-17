export function filtersToRGB(baseColor, filters = {}) {
  let r = baseColor.r
  let g = baseColor.g
  let b = baseColor.b

  if (filters.sepia && filters.sepia > 0) {
    const sepia = Math.min(Math.max(filters.sepia, 0), 255)
    const rNew = r * (1 - 0.607 * sepia) + g * 0.769 * sepia + b * 0.189 * sepia
    const gNew = r * 0.349 * sepia + g * (1 - 0.314 * sepia) + b * 0.168 * sepia
    const bNew = r * 0.272 * sepia + g * 0.534 * sepia + b * (1 - 0.869 * sepia)
    r = rNew
    g = gNew
    b = bNew
  }

  if (filters.saturation && filters.saturation !== 1) {
    const s = Math.max(filters.saturation, 0)
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b
    r = gray + (r - gray) * s
    g = gray + (g - gray) * s
    b = gray + (b - gray) * s
  }

  if (filters.brightness && filters.brightness !== 1) {
    const brightness = Math.max(filters.brightness, 0)
    r = Math.min(r * brightness, 255)
    g = Math.min(g * brightness, 255)
    b = Math.min(b * brightness, 255)
  }

  if (filters.contrast && filters.contrast !== 1) {
    const contrast = filters.contrast
    const intercept = 0.5 * (1 - contrast) * 255
    r = r * contrast + intercept
    g = g * contrast + intercept
    b = b * contrast + intercept
  }

  if (filters.hueRotate && filters.hueRotate !== 0) {
    const hue = (filters.hueRotate * Math.PI) / 180
    const cos = Math.cos(hue)
    const sin = Math.sin(hue)

    const rNew =
      r * (0.213 + cos * 0.787 - sin * 0.213) +
      g * (0.715 - cos * 0.715 - sin * 0.715) +
      b * (0.072 - cos * 0.072 + sin * 0.928)

    const gNew =
      r * (0.213 - cos * 0.213 + sin * 0.143) +
      g * (0.715 + cos * 0.285 + sin * 0.14) +
      b * (0.072 - cos * 0.072 - sin * 0.283)

    const bNew =
      r * (0.213 - cos * 0.213 - sin * 0.787) +
      g * (0.715 - cos * 0.715 + sin * 0.715) +
      b * (0.072 + cos * 0.928 + sin * 0.072)

    r = Math.max(0, Math.min(255, rNew))
    g = Math.max(0, Math.min(255, gNew))
    b = Math.max(0, Math.min(255, bNew))
  }

  r = Math.max(0, Math.min(255, Math.round(r)))
  g = Math.max(0, Math.min(255, Math.round(g)))
  b = Math.max(0, Math.min(255, Math.round(b)))

  return `rgb(${r},${g},${b})`
}
