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
  TRANSFER_SRC: 4,
  TRANSFER_DST: 8,
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
