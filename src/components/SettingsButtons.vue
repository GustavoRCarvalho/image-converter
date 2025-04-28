<script setup>
import { storeToRefs } from "pinia"
import { useSettingsStore } from "../store/settings"

const SettingsStore = useSettingsStore()
const { nextSize, toggleColored } = SettingsStore
const { size, colored } = storeToRefs(SettingsStore)
</script>
<template>
  <button @click="toggleColored">
    {{ colored ? "COLORIDO" : "MONOCROMÁTICO" }}
  </button>
  <button @click="nextSize">{{ size }}</button>
</template>
