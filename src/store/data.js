import { defineStore } from "pinia"
import { ref } from "vue"
import { handleImageUpload } from "../utils/handleFile"

const sizesUtilLib = {
  small: "medium",
  medium: "large",
  large: "small",
}

export const useDataStore = defineStore("data", {
  state: () => ({
    data: ref([]),
    isGif: ref(false),
    isGifHighQuality: ref(false),
    ascii: ref({ small: [], medium: [], large: [] }),
    size: ref("small"),
    colored: ref(true),
    zoom: ref(1),
  }),
  actions: {
    async setData(file) {
      if (file && file.type.match("image.*")) {
        this.isGif = file.type === "image/gif"
        if (this.size == "large" && this.isGif) nextSize()
        for (const { image } of this.data) {
          if (image?.src) {
            URL.revokeObjectURL(image.src)
          }
        }
        const images = handleImageUpload(file)
        this.data = await images
      }
    },
    setASCII(arraysAscii) {
      this.ascii.small = arraysAscii.small
      this.ascii.medium = arraysAscii.medium
      this.ascii.large = arraysAscii.large || []
    },
    nextSize() {
      if (this.isGif && !this.isGifHighQuality) {
        this.size = this.size === "small" ? "medium" : "small"
        return
      }
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
