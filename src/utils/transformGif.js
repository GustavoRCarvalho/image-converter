import { parseGIF, decompressFrames } from "gifuct-js"

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export async function extractGifFramesAdvanced(gifFile) {
  // Fetch o arquivo GIF
  // const response = await fetch(gifUrl)
  // const buffer = await response.arrayBuffer()

  const buffer = await readFileAsArrayBuffer(gifFile)
  // // Parse o GIF
  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, true)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = gif.lsd.width
  canvas.height = gif.lsd.height

  const frameImages = []

  // Processe cada frame
  frames.forEach((frame, _i) => {
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height
    )

    ctx.putImageData(imageData, frame.dims.left, frame.dims.top)

    frameImages.push({
      imageUrl: canvas.toDataURL("image/png"),
      delay: frame.delay,
      disposalType: frame.disposalType,
    })
  })

  return frameImages
}
export async function extractGifFramesAdvanced2(gifFile) {
  try {
    // Ler o arquivo como ArrayBuffer
    const buffer = await readFileAsArrayBuffer(gifFile)

    // Parse o GIF
    const gif = parseGIF(buffer)
    const frames = decompressFrames(gif, true)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    canvas.width = gif.lsd.width
    canvas.height = gif.lsd.height

    // Processar todos os frames e criar Promises para cada imagem
    const framePromises = frames.map((frame, i) => {
      return new Promise((resolve, reject) => {
        // Criar ImageData para o frame atual
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        )

        // Desenhar o frame no canvas
        ctx.putImageData(imageData, frame.dims.left, frame.dims.top)

        // Obter a URL de dados do frame
        const imageUrl = canvas.toDataURL("image/png")

        // Criar um objeto Image para o frame
        const img = new Image()
        img.onload = () => {
          resolve({
            type: gifFile.type,
            url: imageUrl, // URL de dados do frame
            delay: frame.delay,
            disposalType: frame.disposalType,
            frameIndex: i,
          })
        }

        img.onerror = () => {
          reject(new Error(`Falha ao carregar frame ${i}`))
        }

        img.src = imageUrl
      })
    })

    // Esperar todas as Promises serem resolvidas
    const frameImages = await Promise.all(framePromises)
    return frameImages
  } catch (error) {
    console.error("Erro ao extrair frames do GIF:", error)
    throw error
  }
}
