export interface GPUColorDict {
  r: number,
  g: number,
  b: number,
  a: number
}

export type GPUColor = number[] | GPUColorDict

export function colorToNumber (color: GPUColor): number {
  if (color instanceof Array) {
    return Math.round(color[3] * 0xFF000000)
         + Math.round(color[2] * 0xFF0000)
         + Math.round(color[1] * 0xFF00)
         + Math.round(color[0] * 0xFF)
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
