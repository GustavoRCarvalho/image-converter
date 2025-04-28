<script setup>
import { ref, watch } from "vue"
import { imageToAsciiAdvanced } from "../utils/imageConverter"
import { handleImageUpload } from "../utils/handleFile.js"

const imagem = ref([])
const textElement = ref([])
const isDragging = ref(false)

watch(
  () => [...imagem.value],
  async (images) => {
    if (textElement.value.length) {
      document
        .getElementById("ascii-container")
        .removeChild(document.getElementById("ascii-container").childNodes[0])
    }
    const array = []
    textElement.value = []
    for (const imagePromisse of images) {
      const image = await imagePromisse
      const text = await imageToAsciiAdvanced(image.url, {
        width: 70,
        colored: true,
        characters: "@%#*+=-:. ",
        fontSize: 16,
        contrast: 1.5,
      })
      if (image?.url) {
        URL.revokeObjectURL(image.url)
      }
      array.push([text, image.delay || 0])
    }
    images = []
    textElement.value = array
  },
  { deep: true }
)

watch(
  () => [...textElement.value],
  (texts) => {
    if (texts.length === 1) {
      document.getElementById("ascii-container").appendChild(texts[0][0])
      return
    }
    gifLoop(texts)
  }
)

function gifLoop(texts) {
  for (let i = 0; i < texts.length; i++) {
    setTimeout(() => {
      if (i) {
        document.getElementById("ascii-container").removeChild(texts[i - 1][0])
      }
      if (i < texts.length - 1) {
        document.getElementById("ascii-container").appendChild(texts[i][0])
        return
      }
      gifLoop(texts)
    }, 100 * i)
  }
}

function handleDragOver() {
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.match("image.*")) {
    handleImageUpload(file, imagem)
  }
}

function handleFile(event) {
  const file = event.target.files[0]
  handleImageUpload(file, imagem)
}
</script>
<template>
  <input type="file" @change="handleFile" />
  <figure
    @drop.prevent="onDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    :class="{ draging: isDragging }"
    id="ascii-container"
    aria-label="An image, traslated to characters. The image is illustrated using
      preformatted text characters."
  ></figure>
</template>
<style scoped>
.draging {
  border-color: red;
}
figure {
  border: 2px dashed rgb(0, 217, 255);
  border-radius: 8px;

  overflow: auto;

  min-height: calc(40vw - 12px);
  max-height: min(calc(90vh - 36px), 700px);

  min-width: calc(40vw - 12px);
  max-width: min(calc(100vw - 36px), 1240px);

  padding: 8px;
  margin: 8px;

  display: flex;
  justify-content: center;

  &::-webkit-scrollbar {
    width: 15px;
    height: 15px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(89, 89, 89);
    border: 5px solid transparent;
    background-clip: padding-box;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    margin: 6px;
    background-color: transparent;
  }
}
</style>
