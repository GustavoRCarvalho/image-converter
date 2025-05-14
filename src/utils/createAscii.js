import { imageToAscii } from "./imageConverter"

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

    textSmall = imageToAscii(image.image, {
      size: "small",
    })

    textMedium = imageToAscii(image.image, {
      size: "medium",
    })

    arraysTexts.small.push([
      textSmall.outputColored,
      textSmall.outputColoredOutline,
      textSmall.asciiHtml,
    ])

    arraysTexts.medium.push([
      textMedium.outputColored,
      textMedium.outputColoredOutline,
      textMedium.asciiHtml,
    ])

    if (!isGif || isGifHighQuality) {
      textLarge = imageToAscii(image.image, {
        size: "large",
      })
      arraysTexts.large.push([
        textLarge.outputColored,
        textLarge.outputColoredOutline,
        textLarge.asciiHtml,
      ])
    }
  }
  return arraysTexts
}
