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

export interface GPUSamplerDescriptor {
  addressModeU: string,
  addressModeV: string,
  addressModeW: string,
  magFilter: string,
  minFilter: string,
  mipmapFilter: string,
  lodMinClamp: number,
  lodMaxClamp: number,
  maxAnisotropy: number,
  compareFunction: string,
  borderColor: string
}

export interface GPUBindGroupLayoutBinding {
  binding: number,
  visibility: number,
  type: string
}

export interface GPUBindGroupLayoutDescriptor {
  bindings: Array<GPUBindGroupLayoutBinding>
}
