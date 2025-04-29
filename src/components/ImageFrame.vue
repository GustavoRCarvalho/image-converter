<script setup>
import { ref, watch } from "vue"
import { imageToAsciiAdvanced } from "../utils/imageConverter"
import { useSettingsStore } from "../store/settings.js"
import { storeToRefs } from "pinia"
import { useDataStore } from "../store/data.js"
import { gifLoop } from "../utils/gifLoop.js"
import { SIZES } from "../utils/constantes.js"

const SettingsStore = useSettingsStore()
const { size, colored, zoom } = storeToRefs(SettingsStore)

const fontSize = ref(SIZES[size.value]?.font * zoom.value + "px")
const lineHeight = ref(SIZES[size.value].lineHeight * zoom.value + "px")
const letterSpacing = ref(SIZES[size.value].letterSpacing * zoom.value + "px")

const DataStore = useDataStore()
const { setData } = DataStore
const { data } = storeToRefs(DataStore)

const textElement = ref([])
const isDragging = ref(false)
const hasData = ref(false)

watch(
  () => zoom.value,
  (zoom) => {
    fontSize.value = SIZES[size.value]?.font * zoom + "px"
    lineHeight.value = SIZES[size.value].lineHeight * zoom + "px"
    letterSpacing.value = SIZES[size.value].letterSpacing * zoom + "px"
  },
  { deep: true }
)

watch(
  () => [[...data.value], colored, size],
  async ([images, colored, size]) => {
    if (!images) return
    if (textElement.value.length) {
      document
        .getElementById("ascii-container")
        .removeChild(document.getElementById("ascii-container").childNodes[1])
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
    if (texts.length === 0) return
    hasData.value = true
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

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  setData(file)
}
</script>
<template>
  <figure
    @drop.prevent="onDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    :style="{
      fontSize: fontSize,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
    }"
    :class="{ draging: isDragging }"
    id="ascii-container"
    aria-label="An image, traslated to characters. The image is illustrated using
      preformatted text characters."
  >
    <span class="dropMessage" v-show="!hasData"
      >DROP IMAGE HERE
      <br />
      <span>[ jpg / png / svg / gif ]</span>
    </span>
  </figure>
</template>
<style>
@keyframes shaking {
  0% {
    border-color: red;
  }
  25% {
    transform: translateX(2px) translateY(2px);
    border-color: grey;
  }
  50% {
    transform: translateX(0px) translateY(-2px);
    border-color: red;
  }
  75% {
    transform: translateX(-2px) translateY(2px);
    border-color: grey;
  }
  100% {
    border-color: red;
  }
}
.dropMessage {
  text-align: center;
  font-size: 20px;
  line-height: 2em;
  letter-spacing: normal;
  color: var(--blue);
  transition: all 0.4s;
  user-select: none;
}
figure:hover .dropMessage {
  color: var(--pink);
}
.draging {
  animation: shaking 0.35s infinite;
}
figure {
  border: 2px dashed var(--blue);
  border-radius: 8px;

  overflow: auto;

  min-height: calc(60vh - 40px);
  max-height: min(calc(90vh - 84px), 700px);

  min-width: min(calc(75vw - 40px), 700px);
  /* 84 = (32 + 8 + 2) * 2 */
  max-width: min(calc(100vw - 84px), 1240px);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 32px;
  margin: 8px;

  &:has(pre) {
    min-width: auto;
    width: min-content;
    min-height: auto;
    height: min-content;
    justify-content: flex-start;
    align-items: flex-start;
  }
  span {
    pointer-events: none;
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

  &:hover {
    box-shadow: 0px 0px 20px 1px rgba(255, 255, 255, 0.3);
    border-color: var(--pink);
  }

  transition: all 0.4s;
}
</style>
