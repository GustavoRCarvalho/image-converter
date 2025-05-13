import { differenceOfGaussians } from "./differenceOfGaussians"

export function sobelFilter(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const width = canvas.width
  const height = canvas.height

  // Obter os dados da imagem
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Criar um array para a imagem em tons de cinza
  const grayData = new Array(width * height)

  // Converter para tons de cinza
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    grayData[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b
  }

  // Kernels Sobel
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ]

  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ]

  // Aplicar o filtro Sobel
  const sobelData = new Uint8ClampedArray(data.length)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0
      let pixelY = 0

      // Convolução com os kernels
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx)
          const gray = grayData[idx]

          pixelX += gray * kernelX[ky + 1][kx + 1]
          pixelY += gray * kernelY[ky + 1][kx + 1]
        }
      }

      // Calcular a magnitude do gradiente
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) | 0
      const idx = (y * width + x) * 4

      // Atribuir o mesmo valor para R, G, B para manter a imagem em tons de cinza
      sobelData[idx] = magnitude
      sobelData[idx + 1] = magnitude
      sobelData[idx + 2] = magnitude
      sobelData[idx + 3] = 255 // Alpha
    }
  }

  // Criar nova ImageData e desenhar no canvas
  const newImageData = new ImageData(sobelData, width, height)
  ctx.putImageData(newImageData, 0, 0)
}

export function sobelFilterColored(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const width = canvas.width
  const height = canvas.height

  // Obter os dados da imagem
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Converter para tons de cinza
  const grayData = new Array(width * height)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    grayData[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b
  }

  // Kernels Sobel
  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ]

  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ]

  // Criar array para o resultado
  const sobelData = new Uint8ClampedArray(data.length)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0
      let pixelY = 0

      // Aplicar os kernels Sobel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx)
          const gray = grayData[idx]

          pixelX += gray * kernelX[ky + 1][kx + 1]
          pixelY += gray * kernelY[ky + 1][kx + 1]
        }
      }

      // Calcular magnitude e direção
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) | 0
      const angle = Math.atan2(pixelY, pixelX) // ângulo em radianos

      const idx = (y * width + x) * 4

      // Definir cores baseado na direção
      if (magnitude > 30) {
        // Threshold para considerar como borda
        // Normalizar o ângulo para 0-π
        const normalizedAngle = (angle + Math.PI) % Math.PI

        // Determinar a direção predominante
        if (
          normalizedAngle < Math.PI / 8 ||
          normalizedAngle > (7 * Math.PI) / 8
        ) {
          // Horizontal - Vermelho
          sobelData[idx] = 255 // R
          sobelData[idx + 1] = 0 // G
          sobelData[idx + 2] = 0 // B
        } else if (
          normalizedAngle > (3 * Math.PI) / 8 &&
          normalizedAngle < (5 * Math.PI) / 8
        ) {
          // Vertical - Verde
          sobelData[idx] = 0
          sobelData[idx + 1] = 255
          sobelData[idx + 2] = 0
        } else if (
          normalizedAngle >= Math.PI / 8 &&
          normalizedAngle <= (3 * Math.PI) / 8
        ) {
          // Diagonal 45° - Azul
          sobelData[idx] = 0
          sobelData[idx + 1] = 0
          sobelData[idx + 2] = 255
        } else {
          // Diagonal 135° - Amarelo
          sobelData[idx] = 255
          sobelData[idx + 1] = 255
          sobelData[idx + 2] = 0
        }
      } else {
        // Não é borda - Preto
        sobelData[idx] = 0
        sobelData[idx + 1] = 0
        sobelData[idx + 2] = 0
      }

      sobelData[idx + 3] = 255 // Alpha
    }
  }

  // Aplicar o resultado no canvas
  const newImageData = new ImageData(sobelData, width, height)
  ctx.putImageData(newImageData, 0, 0)
}

export function sobelFilterASCII(
  img,
  canvas,
  canvasDog,
  width,
  magnitudeScale,
  sigma1,
  sigma2
) {
  const asciiChars = " .:=•+#$%@"
  const proportion = img.naturalWidth / img.naturalHeight
  const height = Math.floor(width / proportion)

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, width, height)

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  const kernelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ]

  const kernelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ]

  let asciiHtmlColored = ""
  let asciiHtml = ""
  const output = document.createElement("pre")
  output.style.fontFamily = "Courier New"
  output.style.fontWeight = "Bold"
  output.style.width = "min-content"

  const sobelData = new Uint8ClampedArray(data.length)
  const pixelsDoF = differenceOfGaussians(data, canvas, sigma1, sigma2)
  canvasDog.width = width
  canvasDog.height = height
  const newDogImageData = new ImageData(pixelsDoF, width, height)
  const ctxDog = canvasDog.getContext("2d", { willReadFrequently: true })
  ctxDog.putImageData(newDogImageData, 0, 0)

  const grayData = new Array(width * height)
  for (let i = 0; i < pixelsDoF.length; i += 4) {
    const r = pixelsDoF[i]
    const g = pixelsDoF[i + 1]
    const b = pixelsDoF[i + 2]
    grayData[i / 4] = 0.34 * r + 0.33 * g + 0.34 * b
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let pixelX = 0
      let pixelY = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx)
          const gray = grayData[idx]

          pixelX += gray * kernelX[ky + 1][kx + 1]
          pixelY += gray * kernelY[ky + 1][kx + 1]
        }
      }

      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY) | 0
      const angle = Math.atan2(pixelX, pixelY)

      const idx = (y * width + x) * 4
      let char = ""

      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]

      if (magnitude > magnitudeScale) {
        if ((angle > -2 && angle < -1.2) || (angle > 1.2 && angle < 2)) {
          // Vertical - Vermelho
          sobelData[idx] = 255
          sobelData[idx + 1] = 0
          sobelData[idx + 2] = 0
          char = "|"
        } else if (
          (angle > -0.4 && angle < 0.4) ||
          angle > 2.75 ||
          angle < -2.75
        ) {
          // Horizonta - Verde
          sobelData[idx] = 0
          sobelData[idx + 1] = 255
          sobelData[idx + 2] = 0
          char = "-"
        } else if (angle < -2 || (angle > 0.4 && angle < 1.2)) {
          // Diagonal 135° - Azul
          sobelData[idx] = 0
          sobelData[idx + 1] = 0
          sobelData[idx + 2] = 255
          char = "/"
        } else {
          // Diagonal 45° - Amarelo
          sobelData[idx] = 255
          sobelData[idx + 1] = 255
          sobelData[idx + 2] = 0
          char = "\\"
        }
      } else {
        // Não é borda - Preto
        sobelData[idx] = 0
        sobelData[idx + 1] = 0
        sobelData[idx + 2] = 0

        const brightness = (0.34 * r + 0.33 * g + 0.34 * b) / 255
        const charIndex = Math.floor(brightness * (asciiChars.length - 1))
        char = asciiChars[charIndex] || " "
      }
      const color = `rgb(${r},${g},${b})`
      asciiHtmlColored += `<span style="color:${color}">${char}</span>`
      asciiHtml += char

      sobelData[idx + 3] = 255 // Alpha
    }
    asciiHtmlColored += "\n"
    asciiHtml += "\n"
  }

  // Aplicar o resultado no canvas
  const newImageData = new ImageData(sobelData, width, height)
  ctx.putImageData(newImageData, 0, 0)
  return { output: asciiHtml, outputColored: asciiHtmlColored }
}
