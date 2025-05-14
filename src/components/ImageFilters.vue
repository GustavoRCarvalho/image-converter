<script setup>
import { onMounted, reactive, ref, watch } from "vue"
import {
  sobelFilter as _,
  sobelFilterColored as _1,
  sobelFilterASCII,
} from "../utils/sobelFilter"

// const BASE_URL = "/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
// const BASE_URL = "/anakin.webp"
const BASE_URL = "/circle.avif"
// const BASE_URL = "/Coca-Cola_logo.png"

const params = reactive({
  width: 50,
  magnitudeScale: 150,
  sigma1: 10,
  sigma2: 0.01,
})
const colored = ref(true)
const data = ref({})

watch(
  () => params,
  ({ width, magnitudeScale, sigma1, sigma2 }) => {
    loadImage(width, magnitudeScale, sigma1, sigma2)
  },
  { deep: true }
)

watch(
  () => [colored.value, data.value],
  ([stateColored, stateData]) => {
    const pre = document.getElementById("preImageFilter")
    if (stateColored) {
      pre.innerHTML = stateData.outputColored
    } else {
      pre.innerHTML = stateData.output
    }
  },
  { deep: true }
)

onMounted(() => {
  loadImage(
    params.width,
    params.magnitudeScale,
    params.sigma1,
    params.sigma2,
    params.colored
  )
})

function loadImage(width, magnitudeScale, sigma1, sigma2) {
  const canvas = document.getElementById("imageFilter")
  const canvasDog = document.getElementById("imageFilterDoG")
  const img = new Image()

  img.onload = function () {
    // sobelFilterColored(canvas)
    data.value = sobelFilterASCII(
      img,
      canvas,
      canvasDog,
      width,
      magnitudeScale,
      sigma1,
      sigma2
    )
  }

  img.src = BASE_URL
}
</script>
<template>
  <label for="magnitudeScale">magnitude Scale</label>
  <input type="number" id="magnitudeScale" v-model="params.magnitudeScale" />
  <label for="sigma1 sigma1-range">sigma 1</label>
  <div class="slider">
    <input
      type="range"
      max="10"
      min="0"
      step="0.01"
      id="sigma1-range"
      v-model="params.sigma1"
    />
    <input type="number" step="0.01" id="sigma1" v-model="params.sigma1" />
  </div>
  <label for="sigma2 sigma2-range">sigma 2</label>
  <div class="slider">
    <input
      type="range"
      max="10"
      min="0"
      step="0.01"
      id="sigma2-range"
      v-model="params.sigma2"
    />
    <input type="number" step="0.01" id="sigma2" v-model="params.sigma2" />
  </div>
  <label for="width">width</label>
  <input type="number" id="width" v-model="params.width" />
  <div class="wrapper">
    <img :src="BASE_URL" alt="" />
    <canvas id="imageFilterDoG"></canvas>
    <canvas id="imageFilter"></canvas>
  </div>
  <pre id="preImageFilter"></pre>
</template>
<style scoped>
canvas,
img {
  width: 30%;
}
pre {
  font-size: 4;
  line-height: 0.75;
  letter-spacing: 0.75;

  color: #a33e3e;
}
.slider {
  width: 400px;

  input {
    width: 100%;
  }
}

.wrapper {
  display: flex;
}
</style>
