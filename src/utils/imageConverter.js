import { SIZES } from "./constantes"

export async function imageToAsciiAdvanced(image, options = {}) {
  const {
    size = "small",
    colored = false,
    backgroundColor = null,
    brightnessOptions = {
      r: 0.299,
      g: 0.587,
      b: 0.114,
    },
  } = options
  const contrast = 1
  const asciiChars = "@%$#+=-:. "
  const fontFamily = "monospace"
  const width = SIZES[size].width

  const img = new Image()

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = () => reject(new Error("Falha ao carregar a imagem"))
    img.src = image
  })

  const proportion = img.naturalWidth / img.naturalHeight
  const height = width / proportion

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0, width, height)

  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  const output = document.createElement("pre")
  output.style.fontFamily = fontFamily
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

      const brightness =
        (brightnessOptions.r * r +
          brightnessOptions.g * g +
          brightnessOptions.b * b) /
        255
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
