import GIF from "gif.js"

export const handleSaveGifAscii = ({ asciiArtList, useColor }) => {
  if (!asciiArtList[0][0]) return

  const canvasList = []

  for (const ascii of asciiArtList) {
    const colorAsciiArt = ascii[1]
    const asciiArt = ascii[2]

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const lines = asciiArt.split("\n").filter((line) => line.length > 0)
    const charHeight = lines.length
    const charWidth = lines[0].length

    const baseScale = 32
    const charAspectRatio = 1

    canvas.width = Math.ceil(charWidth * baseScale * charAspectRatio)
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

    if (useColor) {
      const spans = Array.from(colorAsciiArt.querySelectorAll("span"))
      let spanIndex = 0

      lines.forEach((line, lineIndex) => {
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
          if (spanIndex < spans.length) {
            const span = spans[spanIndex]
            const color = span.style.color
            const rgb = color.match(/\d+/g) || [0, 0, 0]
            const brightenedColor = `rgb(${Math.min(
              255,
              parseInt(rgb[0]) * 1.3
            )}, ${Math.min(255, parseInt(rgb[1]) * 1.3)}, ${Math.min(
              255,
              parseInt(rgb[2]) * 1.3
            )})`
            ctx.fillStyle = brightenedColor
            ctx.fillText(
              span.textContent,
              Math.round(charIndex * fontSize * charAspectRatio),
              Math.round(lineIndex * fontSize)
            )
            spanIndex++
          }
        }
      })
    } else {
      ctx.fillStyle = "#ff2b9d"
      lines.forEach((line, i) => {
        ctx.fillText(line, 0, Math.round(i * fontSize))
      })
    }

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

    document.body.removeChild(link)
    URL.revokeObjectURL(gifUrl)
  })

  gif.render()
}

export const handleSaveAscii = ({ colorAsciiArt, asciiArt, useColor }) => {
  if (!asciiArt && !colorAsciiArt) return

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  const lines = asciiArt.split("\n").filter((line) => line.length > 0)
  const charHeight = lines.length
  const charWidth = lines[0].length

  const baseScale = 32
  const charAspectRatio = 1

  canvas.width = Math.ceil(charWidth * baseScale * charAspectRatio)
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

  if (useColor) {
    const spans = Array.from(colorAsciiArt.querySelectorAll("span"))
    let spanIndex = 0

    lines.forEach((line, lineIndex) => {
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        if (spanIndex < spans.length) {
          const span = spans[spanIndex]
          const color = span.style.color
          const rgb = color.match(/\d+/g) || [0, 0, 0]
          const brightenedColor = `rgb(${Math.min(
            255,
            parseInt(rgb[0]) * 1.3
          )}, ${Math.min(255, parseInt(rgb[1]) * 1.3)}, ${Math.min(
            255,
            parseInt(rgb[2]) * 1.3
          )})`
          ctx.fillStyle = brightenedColor
          ctx.fillText(
            span.textContent,
            Math.round(charIndex * fontSize * charAspectRatio),
            Math.round(lineIndex * fontSize)
          )
          spanIndex++
        }
      }
    })
  } else {
    ctx.fillStyle = "#ff2b9d"
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, Math.round(i * fontSize))
    })
  }

  const link = document.createElement("a")
  link.download = "ascii-art.png"
  link.href = canvas.toDataURL("image/png", 1.0)
  link.click()

  document.body.removeChild(link)
}
// Adaptado do código original
// https://github.com/solst-ice/itoa/blob/main/src/App.jsx#L390
