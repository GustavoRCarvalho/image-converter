import { defineStore } from "pinia"
import { ref } from "vue"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    size: ref("small"),
    colored: ref(true),
  }),
  actions: {
    changeSize(newSize) {
      this.size = newSize
    },
    toggleColored() {
      this.colored = !this.colored
    },
  },
})
