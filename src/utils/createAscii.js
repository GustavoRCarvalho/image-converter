import { imageToAsciiAdvanced } from "./imageConverter"

export function createASCII({ images, isGif, isGifHighQuality }) {
  const arraysTexts = {
    small: [],
    medium: [],
    large: [],
  }
  for (const image of images) {
    let textSmall,
      textMedium,
      textLarge = {}

    textSmall = imageToAsciiAdvanced(image.image, {
      size: "small",
    })

    textMedium = imageToAsciiAdvanced(image.image, {
      size: "medium",
    })

    arraysTexts.small.push([
      textSmall.output,
      textSmall.outputColored,
      textSmall.asciiHtml,
    ])

    arraysTexts.medium.push([
      textMedium.output,
      textMedium.outputColored,
      textMedium.asciiHtml,
    ])

    if (!isGif || isGifHighQuality) {
      textLarge = imageToAsciiAdvanced(image.image, {
        size: "large",
      })
      arraysTexts.large.push([
        textLarge.output,
        textLarge.outputColored,
        textLarge.asciiHtml,
      ])
    }
  }
  return arraysTexts
}
