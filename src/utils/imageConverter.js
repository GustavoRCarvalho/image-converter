const SIZES = {
  small: 60,
  medium: 150,
  large: 300,
}

const FONTSIZES = {
  small: "12.27px",
  medium: "7.11px",
  large: "3px",
}

const LINEHEIGHTSIZES = {
  small: "8px",
  medium: "5px",
  large: "2.4px",
}

export async function imageToAsciiAdvanced(image, options = {}) {
  const { size = "small", colored = false, backgroundColor = null } = options
  const contrast = 1
  const asciiChars = "@%#*+=-:. "
  const fontFamily = "monospace"
  const width = SIZES[size]
  const fontSize = FONTSIZES[size]
  const lineHeight = LINEHEIGHTSIZES[size]

  const img = new Image()

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = () => reject(new Error("Falha ao carregar a imagem"))
    img.src = image
  })

  const proportion = img.naturalWidth / img.naturalHeight
  const height = width / proportion

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  canvas.width = width
  canvas.height = height
  ctx.filter = `contrast(${contrast})`
  ctx.drawImage(img, 0, 0, width, height)
  ctx.filter = "none"

  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  const output = document.createElement("pre")
  output.style.fontFamily = fontFamily
  output.style.fontSize = fontSize
  output.style.lineHeight = lineHeight
  output.style.letterSpacing = `1px`
  output.style.margin = "0"
  output.style.padding = "0"
  output.style.width = "min-content"

  if (backgroundColor) {
    output.style.backgroundColor = backgroundColor
  }

  let asciiHtml = ""

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = (y * width + x) * 4
      const r = pixels[pixelIndex]
      const g = pixels[pixelIndex + 1]
      const b = pixels[pixelIndex + 2]

      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      const charIndex = Math.floor(brightness * (asciiChars.length - 1))
      const char = asciiChars[charIndex] || " "

      if (colored) {
        const color = `rgb(${r},${g},${b})`
        asciiHtml += `<span style="color:${color}">${char}</span>`
      } else {
        asciiHtml += char
      }
    }
    asciiHtml += "\n"
  }

  output.innerHTML = asciiHtml
  return output
}
