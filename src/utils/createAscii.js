import { imageToAscii } from "./imageConverter"
import { SIZES, SIZES_GIF } from "./constantes"

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
      widthSize: isGif ? SIZES_GIF["small"].width : SIZES["small"].width,
    })

    textMedium = imageToAscii(image.image, {
      widthSize: isGif ? SIZES_GIF["medium"].width : SIZES["medium"].width,
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
        widthSize: isGif ? SIZES_GIF["large"].width : SIZES["large"].width,
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
