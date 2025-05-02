import { imageToAsciiAdvanced } from "./imageConverter"

export async function createASCII({ images, isGif, setASCII }) {
  const arraysTexts = {
    small: [],
    medium: [],
    large: [],
  }
  for (const imagePromisse of images) {
    const image = await imagePromisse

    let textSmall,
      textMedium,
      textLarge = {}

    textSmall = await imageToAsciiAdvanced(image.url, {
      size: "small",
    })

    textMedium = await imageToAsciiAdvanced(image.url, {
      size: "medium",
    })

    arraysTexts.small.push([textSmall.output, textSmall.outputColored])
    arraysTexts.medium.push([textMedium.output, textMedium.outputColored])

    if (!isGif) {
      textLarge = await imageToAsciiAdvanced(image.url, {
        size: "large",
      })
      arraysTexts.large.push([textLarge.output, textLarge.outputColored])
    }

    setASCII({
      textSmall: textSmall.asciiHtml,
      textMedium: textMedium.asciiHtml,
      textLarge: textLarge?.asciiHtml || null,
    })
  }
  return arraysTexts
}
