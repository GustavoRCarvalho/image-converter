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
  }),
  actions: {
    nextSize() {
      this.size = sizesUtilLib[this.size]
    },
    toggleColored() {
      this.colored = !this.colored
    },
  },
})
