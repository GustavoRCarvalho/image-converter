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
        for (const images of this.data) {
          if (images?.url) {
            URL.revokeObjectURL(images.url)
          }
        }
        const images = handleImageUpload(file)
        this.data = await images
      }
    },
  },
})
