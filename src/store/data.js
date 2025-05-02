import { defineStore } from "pinia"
import { ref } from "vue"
import { handleImageUpload } from "../utils/handleFile"

export const useDataStore = defineStore("data", {
  state: () => ({
    data: ref([]),
    isGif: ref(false),
    ascii: ref({ small: "", medium: "", large: "" }),
  }),
  actions: {
    async setData(file, nextSize, size) {
      if (file && file.type.match("image.*")) {
        this.isGif = file.type === "image/gif"
        if (size == "large" && this.isGif) nextSize(this.isGif)
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
  },
})
