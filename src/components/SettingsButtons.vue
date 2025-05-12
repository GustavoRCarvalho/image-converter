<script setup>
import { storeToRefs } from "pinia"
import { useDataStore } from "../store/data"
import { handleSaveAscii, handleSaveGifAscii } from "../utils/exportImage"
import { ref, watch } from "vue"

const DataStore = useDataStore()
const { setData, nextSize, nextZoom, toggleColored } = DataStore
const { ascii, size, zoom, colored, isGif } = storeToRefs(DataStore)

const hasData = ref(false)

watch(
  () => ascii.value,
  (asciiValue) => {
    hasData.value = !!asciiValue.small.length
  },
  { deep: true }
)

function handleFile(e) {
  const file = e.target.files[0]
  setData(file)
}

async function handleDownload() {
  isGif.value
    ? handleSaveGifAscii({
        asciiArtList: ascii.value[size.value],
        size: size.value,
        useColor: true,
      })
    : handleSaveAscii({
        colorAsciiArt: ascii.value[size.value][0][1],
        asciiArt: ascii.value[size.value][0][2],
        size: size.value,
        useColor: true,
      })
}
</script>
<template>
  <div class="optionsContainer">
    <button :class="{ buttonColored: colored }" @click="toggleColored">
      {{ colored ? "COLORIDO" : "MONOCROMÁTICO" }}
    </button>
    <button class="flickerButton" :data-text="size" @click="nextSize">
      {{ size }}
    </button>
    <label class="uploadButton" data-text="upload" for="file">upload</label>
    <input v-show="false" id="file" type="file" @change="handleFile" />
    <button
      class="downloadButton"
      :disabled="!hasData"
      :data-text="size"
      @click="handleDownload"
    >
      Download
    </button>
    <button class="zoomButton" @click="nextZoom">{{ zoom }}x</button>
  </div>
</template>
<style scoped>
.optionsContainer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 1em;
}

button,
label {
  font-family: Silkscreen, system-ui, Avenir;
  position: relative;
  font-size: 14px;
  text-align: center;

  background-color: transparent;
  color: var(--blue);

  padding-block: 7px;

  border: 1px solid var(--blue);
  border-radius: 8px;

  width: 140px;

  cursor: pointer;

  &:hover {
    border-color: var(--pink);
    color: var(--pink);
  }
  transition: all 0.4s;
}
.zoomButton {
  width: max-content;
  padding: 7px;
}

@keyframes line-orange {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 3.825em;
  }
}

.downloadButton:hover:not([disabled]) {
  border-color: rgb(255, 145, 0);
  color: rgb(255, 145, 0);

  background: linear-gradient(
    transparent 70%,
    rgba(255, 145, 0, 0.726) 90%,
    transparent
  );
  background-size: 24px 150%;
  animation: line-orange 1s linear infinite;
}

.downloadButton:disabled {
  border-color: rgb(0, 243, 255, 50%);
  color: rgb(0, 243, 255, 50%);
  cursor: default;
}

@keyframes line-green {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -3.825em;
  }
}

.uploadButton:hover {
  background: linear-gradient(
    rgba(0, 255, 0, 0.075),
    rgba(0, 255, 0, 0.2) 50%,
    rgba(0, 255, 0, 0.075)
  );
  background-size: 24px 150%;
  border-color: var(--green);
  color: var(--green);
  animation: line-green 0.6s linear infinite;
  overflow: hidden;
}

@keyframes flicker-upload {
  0%,
  100% {
    opacity: 0;
    text-shadow: none;
  }
  15% {
    opacity: 1;
    text-shadow:
      -2px 0 white,
      2px 0 var(--green);
  }
  17% {
    opacity: 0;
    text-shadow: none;
  }
  20% {
    opacity: 1;
    text-shadow:
      2px 0 white,
      -2px 0 var(--green),
      0 0 20px rgba(144, 255, 144, 0.5);
  }
  22% {
    opacity: 0;
    text-shadow: none;
  }
  35% {
    opacity: 1;
    text-shadow:
      -1px 0 var(--green),
      1px 0 white,
      0 0 20px rgba(130, 255, 130, 0.5);
  }
  37% {
    opacity: 0;
    text-shadow: none;
  }
  40% {
    opacity: 1;
    text-shadow:
      2px 0 var(--green),
      -2px 0 white;
  }
  42% {
    opacity: 0;
    text-shadow: none;
  }
  85% {
    opacity: 1;
    text-shadow:
      -1px 0 white,
      1px 0 var(--green),
      0 0 20px rgba(43, 255, 43, 0.5);
  }
  87% {
    opacity: 0;
    text-shadow: none;
  }
}

.uploadButton:hover:before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  filter: blur(1px);
  animation: flicker-upload 2s linear infinite;
}

@keyframes upload-after {
  0% {
    top: 1.75em;
  }
  100% {
    top: -2.25em;
  }
}

.uploadButton:hover:after {
  content: "011001010";
  position: absolute;
  opacity: 0.2;
  left: 0;
  right: 0;
  text-align: center;
  animation: upload-after 0.6s linear infinite;
}

@keyframes rainbow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 24px 0;
  }
}

.buttonColored {
  background: linear-gradient(
    to right,
    red,
    red 16.67%,
    #f90 16.67%,
    #f90 33.33%,
    #3f0 33.33%,
    #3f0 50%,
    #0fc 50%,
    #0fc 66.67%,
    #09f 66.67%,
    #09f 83.33%,
    #f0f 83.33%,
    #f0f
  );
  background-size: 24px 100%;
  animation: rainbow 2s linear infinite;
  color: black;
  border-color: transparent;
  &:hover {
    color: black;
    border-color: transparent;
  }
}

@keyframes flicker {
  0%,
  100% {
    opacity: 0;
    text-shadow: none;
  }
  15% {
    opacity: 1;
    text-shadow:
      -1px 0 var(--blue),
      1px 0 var(--pink);
  }
  17% {
    opacity: 0;
    text-shadow: none;
  }
  20% {
    opacity: 1;
    text-shadow:
      1px 0 var(--blue),
      -1px 0 var(--pink),
      0 0 20px rgba(255, 43, 157, 0.5);
  }
  22% {
    opacity: 0;
    text-shadow: none;
  }
  35% {
    opacity: 1;
    text-shadow:
      -1px 0 var(--pink),
      1px 0 var(--blue),
      0 0 20px rgba(0, 243, 255, 0.5);
  }
  37% {
    opacity: 0;
    text-shadow: none;
  }
  40% {
    opacity: 1;
    text-shadow:
      1px 0 var(--pink),
      -1px 0 var(--blue);
  }
  42% {
    opacity: 0;
    text-shadow: none;
  }
  85% {
    opacity: 1;
    text-shadow:
      -1px 0 var(--blue),
      1px 0 var(--pink),
      0 0 20px rgba(255, 43, 157, 0.5);
  }
  87% {
    opacity: 0;
    text-shadow: none;
  }
}

.flickerButton:hover:before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  filter: blur(1px);
  animation: flicker 2s linear infinite;
}
</style>
