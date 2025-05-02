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
    ascii: ref({ small: "", medium: "", large: "" }),
    size: ref("small"),
    colored: ref(true),
    zoom: ref(1),
  }),
  actions: {
    async setData(file) {
      if (file && file.type.match("image.*")) {
        this.isGif = file.type === "image/gif"
        if (this.size == "large" && this.isGif) nextSize()
        for (const imagePromise of this.data) {
          const image = await imagePromise
          if (image?.url) {
            URL.revokeObjectURL(image.url)
          }
        }
        const images = handleImageUpload(file)
        this.data = await images
      }
    },
    setASCII({ stringSmall, stringMedium, stringLarge }) {
      this.ascii.small = stringSmall
      this.ascii.medium = stringMedium
      this.ascii.large = stringLarge
    },
    nextSize() {
      if (this.isGif) {
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
