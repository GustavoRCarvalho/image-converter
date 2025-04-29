export function gifLoop(texts) {
  for (let i = 0; i < texts.length; i++) {
    setTimeout(() => {
      if (i) {
        document.getElementById("ascii-container").removeChild(texts[i - 1][0])
      }
      document.getElementById("ascii-container").appendChild(texts[i][0])
      if (i == texts.length - 1) {
        gifLoop(texts)
        setTimeout(() => {
          document.getElementById("ascii-container").removeChild(texts[i][0])
        }, 0)
      }
    }, 100 * i)
  }
}
