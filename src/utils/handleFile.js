import { extractGifFramesAdvanced2 } from "./transformGif"

export async function handleImageUpload(file, imagemSelecionada) {
  if (!file) return

  try {
    const imageData = await loadImageFile(file)
    imagemSelecionada.value = imageData
    console.log("Imagem carregada:", imagemSelecionada.value)
    // Faça algo com a imagem aqui
  } catch (error) {
    console.error("Erro ao carregar imagem:", error)
  }
}

async function loadImageFile(file) {
  if (!file.type.match("image.*")) {
    throw new Error("Arquivo não é uma imagem")
  }

  if (file.type == "image/gif") {
    return extractGifFramesAdvanced2(file)
  }

  return [
    new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        resolve({
          file: file,
          url: imageUrl,
          image: img,
          width: img.width,
          height: img.height,
        })
      }

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        reject(new Error("Falha ao carregar imagem"))
      }

      img.src = imageUrl
    }),
  ]
}
