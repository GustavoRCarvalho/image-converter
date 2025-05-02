export const handleSaveAscii = ({ asciiColor, ascii, useColor }) => {
  const asciiArt = ascii
  const colorAsciiArt = asciiColor

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
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = colorAsciiArt
    const pre = tempDiv.querySelector("pre")
    const spans = Array.from(pre.querySelectorAll("span"))
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
}
// Adaptado do código original
// https://github.com/solst-ice/itoa/blob/main/src/App.jsx#L390
