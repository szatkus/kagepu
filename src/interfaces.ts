export interface GPUBufferDescriptor {
  size: number,
  usage: number
}

export interface GPUTextureDescriptor {
  size: GPUExtent3D,
  arrayLayerCount: number,
  mipLevelCount: number,
  sampleCount: number,
  dimension: string,
  format: string,
  usage: number
}

export interface GPUExtent3D {
  width: number,
  height: number,
  depth: number
}

export interface GPUTextureViewDescriptor {
  format: string,
  dimension: string,
  aspect: number,
  baseMipLevel: number,
  mipLevelCount: number,
  baseArrayLayer: number,
  arrayLayerCount: number
}
