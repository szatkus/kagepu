export function colorToNumber (color: GPUColor): number {
  let redValue = 0xFF000000
  let greenValue = 0xFF0000
  let blueValue = 0xFF00
  let alphaValue = 0xFF
  if (color instanceof Array) {
    return Math.round(color[3] * redValue)
         + Math.round(color[2] * greenValue)
         + Math.round(color[1] * blueValue)
         + Math.round(color[0] * alphaValue)
  }
  return colorToNumber([color.r, color.g, color.b, color.a])
}
