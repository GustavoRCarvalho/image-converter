import GIF from "gif.js"
import { filtersToRGB } from "./filtersToRGB"
import {
  BASE_SCALE_LIB,
  FILTER1_CUSTOM,
  FILTER_COLORED_CUSTOM,
  SIZES,
} from "./constantes"

export const handleSaveGifAscii = ({
  asciiArtList,
  size,
  useColor,
  useOutline,
}) => {
  if (!asciiArtList[0][0] && !asciiArtList[0][2]) return

  const linesFixed = asciiArtList[0][2]
    .split("\n")
    .filter((line) => line.length > 0)

  const optionsCanvas = gerateOptionsCanvas({
    size: size,
    useColor: useColor,
    linesYLength: linesFixed.length,
    linesXLength: linesFixed[0].length,
  })

  let canvasList = []

  for (const ascii of asciiArtList) {
    const colorAsciiArt = ascii[useOutline ? 1 : 0]
    const lines = ascii[2].split("\n").filter((line) => line.length > 0)

    const canvas = createCanvasFromHtmlElement(colorAsciiArt, {
      ...optionsCanvas,
      lines: lines,
    })

    canvasList.push(canvas)
  }

  let gif = new GIF({
    workers: 2,
    workerScript: "./gif.worker.js",
    quality: 20,
    width: optionsCanvas.canvasWidth,
    height: optionsCanvas.canvasHeight,
  })

  canvasList.forEach((canvas) => {
    gif.addFrame(
      canvas
        .getContext("2d")
        .getImageData(
          0,
          0,
          optionsCanvas.canvasWidth,
          optionsCanvas.canvasHeight
        ),
      {
        delay: 63,
      }
    )
  })

  gif.on("finished", (blob) => {
    const gifUrl = URL.createObjectURL(blob)

    downloadCanvas(gifUrl, "gif")

    URL.revokeObjectURL(gifUrl)
    canvasList = null
    gif.abort()
    gif = null
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

  const lines = asciiArt.split("\n").filter((line) => line.length > 0)

  const optionsCanvas = gerateOptionsCanvas({
    size: size,
    useColor: useColor,
    linesYLength: lines.length,
    linesXLength: lines[0].length,
  })

  let canvas = createCanvasFromHtmlElement(colorAsciiArt, {
    ...optionsCanvas,
    lines: lines,
  })
  const canvasURL = canvas.toDataURL("image/png", 1.0)

  downloadCanvas(canvasURL, "png")

  URL.revokeObjectURL(canvasURL)
  canvas = null // garante que o canvas não possua referência para que o garbage collector o remova da memória
}

const gerateOptionsCanvas = ({
  size,
  useColor,
  linesYLength,
  linesXLength,
}) => {
  const fontSize = SIZES[size].font * BASE_SCALE_LIB[size]
  const lineHeight = SIZES[size].lineHeight * BASE_SCALE_LIB[size]
  return {
    lineHeight: lineHeight,
    font: `bold ${fontSize}px "Courier New"`,
    fillStyle: "#0a0a0f",
    filter: useColor ? FILTER_COLORED_CUSTOM : FILTER1_CUSTOM,
    canvasHeight: Math.ceil(linesYLength * lineHeight),
    canvasWidth: Math.ceil(linesXLength * lineHeight),
  }
}

function createCanvasFromHtmlElement(
  element,
  { font, fillStyle, lineHeight, lines, filter, canvasHeight, canvasWidth }
) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  ctx.fillStyle = fillStyle
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.font = font

  const spans = Array.from(element.querySelectorAll("span"))
  let spanIndex = 0

  lines.forEach((line, lineIndex) => {
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      if (spanIndex < spans.length) {
        const span = spans[spanIndex]
        const color = span.style.color
        const rgb = color.match(/\d+/g) || [0, 0, 0]
        const baseRGB = {
          r: Math.min(255, rgb[0]),
          g: Math.min(255, rgb[1]),
          b: Math.min(255, rgb[2]),
        }
        ctx.fillStyle = filtersToRGB(baseRGB, filter)
        ctx.fillText(
          span.textContent,
          Math.round(charIndex * lineHeight),
          Math.round(lineIndex * lineHeight)
        )
        spanIndex++
      }
    }
  })

  return canvas
}
// Adaptado do código original
// https://github.com/solst-ice/itoa/blob/main/src/App.jsx#L390

function downloadCanvas(url, type = "png") {
  const link = document.createElement("a")
  link.download = `ascii-art.${type}`
  link.href = url
  link.click()
}
