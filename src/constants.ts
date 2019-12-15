export const extensions = {
  anisotropicFiltering: false
}
export const limits = {
  maxBindGroups: 8
}
export const GPUBufferUsage = {
  NONE: 0,
  MAP_READ: 1,
  MAP_WRITE: 2,
  COPY_SRC: 4,
  COPY_DST: 8,
  INDEX: 16,
  VERTEX: 32,
  UNIFORM: 64,
  STORAGE: 128
}

export const GPUTextureUsage = {
  NONE: 0,
  TRANSFER_SRC: 1,
  TRANSFER_DST: 2,
  SAMPLED: 4,
  STORAGE: 8,
  OUTPUT_ATTACHMENT: 16
}

export const GPUTextureAspect = {
  COLOR: 1,
  DEPTH: 2,
  STENCIL: 4
}

export const GPUShaderStage = {
  NONE: 0,
  VERTEX: 1,
  FRAGMENT: 2,
  COMPUTE: 4
}

export const GPUColorWriteBits = {
  NONE: 0x0,
  RED: 0x1,
  GREEN: 0x2,
  BLUE: 0x4,
  ALPHA: 0x8,
  ALL: 0xF
}
