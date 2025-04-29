import { defineStore } from "pinia"
import { ref } from "vue"

const sizesUtilLib = {
  small: "medium",
  medium: "large",
  large: "small",
}

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    size: ref("small"),
    colored: ref(true),
    zoom: ref(1),
  }),
  actions: {
    nextSize() {
      this.size = sizesUtilLib[this.size]
    },
    toggleColored() {
      this.colored = !this.colored
    },
    nextZoom() {
      if (this.zoom == 8) {
        this.zoom = 1
        return
      }
      this.zoom *= 2
    },
  },
})
