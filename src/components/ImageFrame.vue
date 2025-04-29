<script setup>
import { ref, watch } from "vue"
import { imageToAsciiAdvanced } from "../utils/imageConverter"
import { handleImageUpload } from "../utils/handleFile.js"
import { useSettingsStore } from "../store/settings.js"
import { storeToRefs } from "pinia"
import { useDataStore } from "../store/data.js"
import { gifLoop } from "../utils/gifLoop.js"

const SettingsStore = useSettingsStore()
const { size, colored } = storeToRefs(SettingsStore)

const DataStore = useDataStore()
const { setData } = DataStore
const { data } = storeToRefs(DataStore)

const textElement = ref([])
const isDragging = ref(false)

watch(
  () => [[...data.value], colored, size],
  async ([images, colored, size]) => {
    if (!images) return
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
        size: size.value,
        colored: colored.value,
      })
      array.push([text, image.delay || 0])
    }
    textElement.value = array
  },
  { deep: true }
)

watch(
  () => textElement.value,
  (texts) => {
    if (texts.length === 1) {
      document.getElementById("ascii-container").appendChild(texts[0][0])
      return
    }
    gifLoop(texts)
  }
)

function handleDragOver() {
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  await setData(file)
}
</script>
<template>
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

  &:has(pre) {
    min-width: auto;
    width: min-content;
    min-height: auto;
    height: min-content;
  }

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
