import { SIZES } from "./constantes"

export function imageToAsciiAdvanced(image, options = {}) {
  const {
    size = "small",
    brightnessOptions = {
      r: 0.4,
      g: 0.4,
      b: 0.4,
    },
  } = options
  const asciiChars = " .:-=+#$%@"
  const fontFamily = "Courier New"
  const width = SIZES[size].width

  const img = image

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
  output.style.fontWeight = "Bold"
  output.style.width = "min-content"

  const outputColored = document.createElement("pre")
  outputColored.style.fontFamily = fontFamily
  outputColored.style.fontWeight = "Bold"
  outputColored.style.width = "min-content"

  let asciiHtmlColored = ""
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

      const color = `rgb(${r},${g},${b})`
      asciiHtmlColored += `<span style="color:${color}">${char}</span>`
      asciiHtml += char
    }
    asciiHtmlColored += "\n"
    asciiHtml += "\n"
  }

  output.innerHTML = asciiHtml
  outputColored.innerHTML = asciiHtmlColored
  return { output: output, outputColored: outputColored, asciiHtml: asciiHtml }
}
