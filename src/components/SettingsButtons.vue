<script setup>
import { storeToRefs } from "pinia"
import { useSettingsStore } from "../store/settings"
import { useDataStore } from "../store/data"

const SettingsStore = useSettingsStore()
const { nextSize, nextZoom, toggleColored } = SettingsStore
const { size, zoom, colored } = storeToRefs(SettingsStore)

const DataStore = useDataStore()
const { setData } = DataStore

async function handleFile(e) {
  const file = e.target.files[0]
  await setData(file)
}
</script>
<template>
  <button @click="toggleColored">
    {{ colored ? "COLORIDO" : "MONOCROMÁTICO" }}
  </button>
  <button @click="nextSize">{{ size }}</button>
  <button @click="nextZoom">{{ zoom }} x</button>
  <input type="file" @change="handleFile" />
</template>
