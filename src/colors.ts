import dontKnow from './dontKnow'

export interface GPUColorDict {
  r: number,
  g: number,
  b: number,
  a: number
}

export type GPUColor = number[] | GPUColorDict

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

export const GPUColorWriteBits = {
  NONE: 0x0,
  RED: 0x1,
  GREEN: 0x2,
  BLUE: 0x4,
  ALPHA: 0x8,
  ALL: 0xF
}
