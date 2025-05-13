export function differenceOfGaussians(pixels, canvas, sigma1, sigma2) {
  const newPixels = new Uint8ClampedArray(pixels)
  const pixelsCopy1 = new Uint8ClampedArray(pixels)
  const pixelsCopy2 = new Uint8ClampedArray(pixels)

  // Aplica Gaussianas com sigmas diferentes
  applyGaussianBlur(pixelsCopy1, canvas.width, canvas.height, sigma1) // σ₁ = 3
  applyGaussianBlur(pixelsCopy2, canvas.width, canvas.height, sigma2) // σ₂ = 1

  // Calcula a diferença
  for (let i = 0; i < pixels.length; i++) {
    newPixels[i] = pixelsCopy1[i] - pixelsCopy2[i] + 128 // +128 para visualização
  }

  return newPixels
}

function applyGaussianBlur(pixels, width, height, sigma) {
  const kernel = generateGaussianKernel(sigma)
  const tempPixels = new Uint8ClampedArray(pixels.length)

  // Aplica horizontalmente
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      applyKernelAtPixel(pixels, tempPixels, width, height, x, y, kernel, true)
    }
  }

  // Aplica verticalmente
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      applyKernelAtPixel(tempPixels, pixels, width, height, x, y, kernel, false)
    }
  }
}

function generateGaussianKernel(sigma) {
  const radius = Math.ceil(sigma * 3)
  const kernel = []
  let sum = 0

  for (let i = -radius; i <= radius; i++) {
    const value = Math.exp(-(i * i) / (2 * sigma * sigma))
    kernel.push(value)
    sum += value
  }

  // Normaliza o kernel
  return kernel.map((v) => v / sum)
}

function applyKernelAtPixel(
  srcPixels,
  dstPixels,
  width,
  height,
  x,
  y,
  kernel,
  isHorizontal
) {
  const radius = Math.floor(kernel.length / 2)
  let r = 0,
    g = 0,
    b = 0,
    sumWeight = 0

  for (let k = -radius; k <= radius; k++) {
    const pos = isHorizontal
      ? (y * width + Math.min(width - 1, Math.max(0, x + k))) * 4
      : (Math.min(height - 1, Math.max(0, y + k)) * width + x) * 4

    const weight = kernel[k + radius]
    r += srcPixels[pos] * weight
    g += srcPixels[pos + 1] * weight
    b += srcPixels[pos + 2] * weight
    sumWeight += weight
  }

  const dstPos = (y * width + x) * 4
  dstPixels[dstPos] = r / sumWeight // R
  dstPixels[dstPos + 1] = g / sumWeight // G
  dstPixels[dstPos + 2] = b / sumWeight // B
  dstPixels[dstPos + 3] = 255 // Alpha (fixo)
}
