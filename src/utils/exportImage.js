import GIF from "gif.js"
import { FILTER1, FILTER_COLORED } from "./constantes"

const BASE_SCALE_LIB = {
  small: 32,
  medium: 24,
  large: 16,
}

export const handleSaveGifAscii = ({
  asciiArtList,
  size,
  useColor,
  useOutline,
}) => {
  if (!asciiArtList[0][0]) return

  const baseScale = BASE_SCALE_LIB[size]
  const canvasList = []

  for (const ascii of asciiArtList) {
    const colorAsciiArt = ascii[useOutline ? 1 : 0]
    const asciiArt = ascii[2]

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const lines = asciiArt.split("\n").filter((line) => line.length > 0)
    const charHeight = lines.length
    const charWidth = lines[0].length

    canvas.width = Math.ceil(charWidth * baseScale)
    canvas.height = Math.ceil(charHeight * baseScale)

    ctx.fillStyle = "#0a0a0f"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.textRendering = "geometricPrecision"
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    const fontSize = baseScale
    ctx.font = `bold ${fontSize}px "Courier New"`
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    ctx.letterSpacing = "0px"

    const spans = Array.from(colorAsciiArt.querySelectorAll("span"))
    let spanIndex = 0

    lines.forEach((line, lineIndex) => {
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        if (spanIndex < spans.length) {
          const span = spans[spanIndex]
          const color = span.style.color
          const rgb = color.match(/\d+/g) || [0, 0, 0]
          ctx.fillStyle = `rgb(${Math.min(
            255,
            parseInt(rgb[0]) * 1.3
          )}, ${Math.min(255, parseInt(rgb[1]) * 1.3)}, ${Math.min(
            255,
            parseInt(rgb[2]) * 1.3
          )})`
          ctx.filter = useColor ? FILTER_COLORED : FILTER1
          ctx.fillText(
            span.textContent,
            Math.round(charIndex * fontSize),
            Math.round(lineIndex * fontSize)
          )
          spanIndex++
        }
      }
    })

    canvasList.push(canvas)
  }
  const gif = new GIF({
    workers: 2,
    workerScript: "./gif.worker.js",
    quality: 20,
    width: canvasList[0].width,
    height: canvasList[0].height,
  })

  canvasList.forEach((canvas) => {
    gif.addFrame(
      canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height),
      { delay: 63 }
    )
  })

  gif.on("finished", (blob) => {
    const gifUrl = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.download = "ascii-art.gif"
    link.href = gifUrl
    link.click()

    URL.revokeObjectURL(gifUrl)
  })

  gif.render()
}

export const handleSaveAscii = ({
  colorAsciiArt,
  asciiArt,
  size,
  useColor,
}) => {
  if (!asciiArt && !colorAsciiArt) return

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const lines = asciiArt.split("\n").filter((line) => line.length > 0)
  const charHeight = lines.length
  const charWidth = lines[0].length

  const baseScale = BASE_SCALE_LIB[size]

  canvas.width = Math.ceil(charWidth * baseScale)
  canvas.height = Math.ceil(charHeight * baseScale)

  ctx.fillStyle = "#0a0a0f"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.textRendering = "geometricPrecision"
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  const fontSize = baseScale
  ctx.font = `bold ${fontSize}px "Courier New"`
  ctx.textBaseline = "top"
  ctx.textAlign = "left"
  ctx.letterSpacing = "0px"

  const spans = Array.from(colorAsciiArt.querySelectorAll("span"))
  let spanIndex = 0

  lines.forEach((line, lineIndex) => {
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      if (spanIndex < spans.length) {
        const span = spans[spanIndex]
        const color = span.style.color
        const rgb = color.match(/\d+/g) || [0, 0, 0]
        ctx.fillStyle = `rgb(${Math.min(
          255,
          parseInt(rgb[0]) * 1.3
        )}, ${Math.min(255, parseInt(rgb[1]) * 1.3)}, ${Math.min(
          255,
          parseInt(rgb[2]) * 1.3
        )})`
        ctx.filter = useColor ? FILTER_COLORED : FILTER1
        ctx.fillText(
          span.textContent,
          Math.round(charIndex * fontSize),
          Math.round(lineIndex * fontSize)
        )
        spanIndex++
      }
    }
  })

  const link = document.createElement("a")
  link.download = "ascii-art.png"
  link.href = canvas.toDataURL("image/png", 1.0)
  link.click()
}
// Adaptado do código original
// https://github.com/solst-ice/itoa/blob/main/src/App.jsx#L390
