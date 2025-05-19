import { BRIGHTNESS_DEFAULT } from "./constantes"
import { differenceOfGaussians } from "./differenceOfGaussians"

// create difference of gaussians and apply sobel filter to create the borders information.
// if the pixel is not a border, uses the traditional brightness method to fill with the right caracter.
export function imageToAscii(img, options = {}) {
  const {
    widthSize = 100,
    brightnessOptions = BRIGHTNESS_DEFAULT,
    magnitudeScale = 150,
    sigma1 = 10,
    sigma2 = 0.01,
  } = options
  // const asciiChars = " .:=•+#$%@"
  const asciiChars = " .•+×¤@#■"
  const proportion = img.naturalHeight / img.naturalWidth
  let height = widthSize
  let width = widthSize
  if (proportion >= 1) {
    width = Math.floor(width / proportion)
  } else {
    height = Math.floor(height * proportion)
  }

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
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

  let asciiHtml = ""
  let asciiHtmlColored = ""
  let asciiHtmlColoredOutline = ""

  const outputColored = document.createElement("pre")
  outputColored.style.width = "min-content"

  const outputColoredOutline = document.createElement("pre")
  outputColoredOutline.style.width = "min-content"

  const pixelsDoF = differenceOfGaussians(data, canvas, sigma1, sigma2)

  const grayData = new Array(width * height)
  for (let i = 0; i < pixelsDoF.length; i += 4) {
    const r = pixelsDoF[i]
    const g = pixelsDoF[i + 1]
    const b = pixelsDoF[i + 2]
    grayData[i / 4] =
      brightnessOptions.r * r +
      brightnessOptions.g * g +
      brightnessOptions.b * b
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
      const angle = Math.atan2(pixelY, pixelX)

      const idx = (y * width + x) * 4
      let char = ""

      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]

      const brightness = Math.min(1, (r + g + b) / 765)
      const charIndex = Math.floor(brightness * (asciiChars.length - 1))
      char = asciiChars[charIndex] || " "
      const color = `rgb(${r},${g},${b})`
      asciiHtml += char
      asciiHtmlColored += `<span style="color:${color}">${char}</span>`

      if (magnitude > magnitudeScale) {
        if ((angle > -2 && angle < -1.2) || (angle > 1.2 && angle < 2)) {
          char = "-"
        } else if (
          (angle > -0.4 && angle < 0.4) ||
          angle > 2.75 ||
          angle < -2.75
        ) {
          char = "|"
        } else if (angle < -2 || (angle > 0.4 && angle < 1.2)) {
          char = "/"
        } else {
          char = "\\"
        }
      }
      asciiHtmlColoredOutline += `<span style="color:${color}">${char}</span>`
    }
    asciiHtml += "\n"
    asciiHtmlColored += "\n"
    asciiHtmlColoredOutline += "\n"
  }

  outputColored.innerHTML = asciiHtmlColored
  outputColoredOutline.innerHTML = asciiHtmlColoredOutline

  return {
    outputColored: outputColored,
    outputColoredOutline: outputColoredOutline,
    asciiHtml: asciiHtml,
  }
}
