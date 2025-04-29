import { defineStore } from "pinia"
import { ref } from "vue"
import { handleImageUpload } from "../utils/handleFile"

export const useDataStore = defineStore("data", {
  state: () => ({
    data: ref([]),
  }),
  actions: {
    async setData(file) {
      if (file && file.type.match("image.*")) {
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
  },
})
