import { parseGIF, decompressFrames } from "gifuct-js"

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export async function extractGifFrames(gifFile) {
  try {
    const buffer = await readFileAsArrayBuffer(gifFile)

    const gif = parseGIF(buffer)
    const frames = decompressFrames(gif, true)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = gif.lsd.width
    canvas.height = gif.lsd.height

    const framePromises = frames.map((frame, i) => {
      return new Promise((resolve, reject) => {
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        )

        ctx.putImageData(imageData, frame.dims.left, frame.dims.top)

        const imageUrl = canvas.toDataURL("image/png")

        const img = new Image()
        img.onload = () => {
          resolve({
            image: img,
            delay: frame.delay,
            frameIndex: i,
          })
        }

        img.onerror = () => {
          reject(new Error(`Falha ao carregar frame ${i}`))
        }

        img.src = imageUrl
      })
    })

    const frameImages = await Promise.all(framePromises)
    return frameImages
  } catch (error) {
    console.error("Erro ao extrair frames do GIF:", error)
    throw error
  }
}
