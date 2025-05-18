<script setup>
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { useDataStore } from "../store/data.js"
import { FILTER1, FILTER_COLORED, SIZES } from "../utils/constantes.js"
import { createASCII } from "../utils/createAscii.js"

const DataStore = useDataStore()
const { setData, setASCII } = DataStore
const { data, ascii, isGif, isGifHighQuality, size, colored, zoom, outline } =
  storeToRefs(DataStore)

const fontSize = ref(SIZES[size.value].font + "px")
const lineHeight = ref(SIZES[size.value].lineHeight + "px")
const letterSpacing = ref(SIZES[size.value].letterSpacing + "px")
let globalIntervalId

watch(
  () => size.value,
  (size) => {
    fontSize.value = SIZES[size].font + "px"
    lineHeight.value = SIZES[size].lineHeight + "px"
    letterSpacing.value = SIZES[size].letterSpacing + "px"
  }
)

const isDragging = ref(false)
const hasData = ref(false)
const content = ref(null)

watch(
  () => data.value,
  (images) => {
    if (!images) return
    setASCII(
      createASCII({
        images: images,
        isGif: isGif.value,
        isGifHighQuality: isGifHighQuality.value,
      })
    )
  },
  { deep: true }
)

watch(
  () => [ascii.value, size.value, outline.value],
  ([texts, size, isOutline], [_oldTexts, oldSize, oldIsOutline]) => {
    const textActual = texts[size]
    if (textActual.length === 0) return
    hasData.value = true
    if (textActual.length > 1 && size == oldSize && isOutline == oldIsOutline) {
      globalIntervalId && clearInterval(globalIntervalId)
      gifLoop(texts)
    }
    if (textActual.length === 1) {
      globalIntervalId && clearInterval(globalIntervalId)
      content.value.firstChild.replaceWith(textActual[0][isOutline ? 1 : 0])
      return
    }
  },
  {
    deep: true,
  }
)

function gifLoop(texts) {
  let i = 0
  globalIntervalId = setInterval(() => {
    if (ascii.value[size.value][0][2] != texts[size.value][0][2]) {
      return
    }
    if (i == texts[size.value].length) {
      i = 0
    } else {
      content.value.firstChild.replaceWith(
        texts[size.value][i][outline.value ? 1 : 0]
      )
    }
    i++
  }, 63)
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
  setData(file)
}
</script>
<template>
  <figure
    @drop.prevent="onDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    :style="{
      '--zoom': zoom,
      fontSize: fontSize,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
    }"
    :class="{
      draging: isDragging,
      hasData: hasData,
      optionLarge: size === 'large',
    }"
    id="ascii-container"
    aria-label="An image, traslated to characters. The image is illustrated using
      preformatted text characters."
  >
    <span class="dropMessage" v-show="!hasData"
      >DROP IMAGE HERE
      <br />
      <span>[ jpg / png / svg / gif ]</span>
    </span>
    <div
      v-show="hasData"
      id="ascii-image"
      ref="content"
      :style="{
        filter: colored ? FILTER_COLORED : FILTER1,
      }"
    >
      <pre></pre>
    </div>
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
.optionLarge:hover {
  box-shadow: none;
  border-color: var(--blue);
}
.hasData {
  min-width: auto;
  width: min-content;
  min-height: auto;
  height: min-content;
  justify-content: flex-start;
  align-items: flex-start;
}
figure {
  border: 2px dashed var(--blue);
  border-radius: 8px;

  overflow: auto;

  min-height: calc(60vh - 40px);
  max-height: min(calc(100vh - 30px), 700px);

  min-width: min(calc(75vw - 40px), 700px);
  max-width: min(calc(100vw - 30px), 1240px);

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 8px;

  span {
    pointer-events: none;
  }

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  &:hover {
    box-shadow: 0px 0px 20px 1px rgba(255, 255, 255, 0.3);
    border-color: var(--pink);
  }

  transition: border-color, color, box-shadow, width;
  transition-duration: 0.4s;
}
pre {
  transform: scale(var(--zoom));
  transform-origin: 0 0;
  transition: transform 0.3s ease;
  padding: calc(5px / var(--zoom));
  font-family: "Courier New";
  font-weight: Bold;
}
</style>
