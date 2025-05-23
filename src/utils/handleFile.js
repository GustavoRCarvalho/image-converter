import { extractGifFrames } from "./transformGif"

export async function handleImageUpload(file) {
  if (!file) return null

  try {
    const imageData = await loadImageFile(file)
    return imageData
  } catch (error) {
    console.error("Erro ao carregar imagem:", error)
    return null
  }
}

async function loadImageFile(file) {
  if (!file.type.match("image.*")) {
    throw new Error("Arquivo não é uma imagem")
  }

  if (file.type == "image/gif") {
    return extractGifFrames(file)
  }

  return [
    await new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        resolve({ image: img })
      }

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        reject(new Error("Falha ao carregar imagem"))
      }

      img.src = imageUrl
    }),
  ]
}
