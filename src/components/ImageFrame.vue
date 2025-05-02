<script setup>
import { ref, watch } from "vue"
import { imageToAsciiAdvanced } from "../utils/imageConverter"
import { useSettingsStore } from "../store/settings.js"
import { storeToRefs } from "pinia"
import { useDataStore } from "../store/data.js"
import { SIZES } from "../utils/constantes.js"

const SettingsStore = useSettingsStore()
const { size, colored, zoom } = storeToRefs(SettingsStore)

const DataStore = useDataStore()
const { setData, setASCII } = DataStore
const { data } = storeToRefs(DataStore)

const fontSize = ref(SIZES[size.value].font + "px")
const lineHeight = ref(SIZES[size.value].lineHeight + "px")
const letterSpacing = ref(SIZES[size.value].letterSpacing + "px")

watch(
  () => size.value,
  (size) => {
    fontSize.value = SIZES[size].font + "px"
    lineHeight.value = SIZES[size].lineHeight + "px"
    letterSpacing.value = SIZES[size].letterSpacing + "px"
  }
)

const textElement = ref([])
const isDragging = ref(false)
const hasData = ref(false)
const content = ref(null)

watch(
  () => [[...data.value], size],
  async ([images, size]) => {
    if (!images) return
    const array = []
    for (const imagePromisse of images) {
      const image = await imagePromisse
      const text = await imageToAsciiAdvanced(image.url, {
        size: size.value,
      })
      array.push([text.output, text.outputColored])
      setASCII(text.asciiHtml)
    }
    textElement.value = array
  },
  { deep: true }
)

watch(
  () => [textElement.value, colored.value],
  ([texts, isColored], [_oldTexts, oldIsColored]) => {
    if (texts.length === 0) return
    if (texts.length > 1 && oldIsColored == isColored) gifLoop(texts, isColored)
    hasData.value = true
    if (texts.length === 1) {
      if (isColored) {
        content.value.firstChild.replaceWith(texts[0][1])
      } else {
        content.value.firstChild.replaceWith(texts[0][0])
      }
      return
    }
  },
  {
    deep: true,
  }
)

function gifLoop(texts, isColored) {
  for (let i = 0; i <= texts.length; i++) {
    setTimeout(() => {
      if (textElement.value[0] != texts[0]) return
      if (i == texts.length) {
        gifLoop(texts, isColored)
      } else {
        if (colored.value) {
          content.value.firstChild.replaceWith(texts[i][1])
        } else {
          content.value.firstChild.replaceWith(texts[i][0])
        }
      }
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
    <div v-show="hasData" id="ascii-image" ref="content">
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
  max-height: min(calc(90vh - 84px), 700px);

  min-width: min(calc(75vw - 40px), 700px);
  /* 84 = (32 + 8 + 2) * 2 */
  max-width: min(calc(100vw - 84px), 1240px);

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

  transition: all 0.4s;
}
pre {
  transform: scale(var(--zoom));
  transform-origin: 0 0;
  transition: transform 0.3s ease;
  padding: calc(32px / var(--zoom));
}
</style>
