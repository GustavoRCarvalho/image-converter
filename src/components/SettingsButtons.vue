<script setup>
import { storeToRefs } from "pinia"
import { useSettingsStore } from "../store/settings"
import { useDataStore } from "../store/data"

const SettingsStore = useSettingsStore()
const { nextSize, nextZoom, toggleColored } = SettingsStore
const { size, zoom, colored } = storeToRefs(SettingsStore)

const DataStore = useDataStore()
const { setData } = DataStore

function handleFile(e) {
  const file = e.target.files[0]
  setData(file)
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
    <label for="file">upload</label>
    <input v-show="false" id="file" type="file" @change="handleFile" />
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

  padding-block: 0.5em;

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
  padding: 0.5em;
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
    text-shadow: -1px 0 var(--blue), 1px 0 var(--pink);
  }
  17% {
    opacity: 0;
    text-shadow: none;
  }
  20% {
    opacity: 1;
    text-shadow: 1px 0 var(--blue), -1px 0 var(--pink),
      0 0 20px rgba(255, 43, 157, 0.5);
  }
  22% {
    opacity: 0;
    text-shadow: none;
  }
  35% {
    opacity: 1;
    text-shadow: -1px 0 var(--pink), 1px 0 var(--blue),
      0 0 20px rgba(0, 243, 255, 0.5);
  }
  37% {
    opacity: 0;
    text-shadow: none;
  }
  40% {
    opacity: 1;
    text-shadow: 1px 0 var(--pink), -1px 0 var(--blue);
  }
  42% {
    opacity: 0;
    text-shadow: none;
  }
  85% {
    opacity: 1;
    text-shadow: -1px 0 var(--blue), 1px 0 var(--pink),
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
