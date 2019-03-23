import GPUPipelineLayout from "./GPUPipelineLayout";
import GPUShaderModule from "./GPUShaderModule";

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

export interface GPUShaderModuleDescriptor {
  code: ArrayBuffer|string
}

export interface GPUPipelineLayoutDescriptor {
  bindGroupLayouts: Array<GPUBindGroupLayout>
}

export interface GPUBindGroupLayout {
}

export interface GPURenderPipelineDescriptor {
  
}

export interface GPUPipelineDescriptorBase {
  layout: GPUPipelineLayout 
}

export interface GPUPipelineStageDescriptor {
  module: GPUShaderModule,
  entryPoint: string
}

export interface GPURasterizationStateDescriptor {
  frontFace: string,
  cullMode: string,
  depthBias: number,
  depthBiasSlopeScale: number,
  depthBiasClamp: number
}

export interface GPUColorStateDescriptor {
  format: string,
  alphaBlend: string,
  colorBlend: string,
  writeMask: string
}

export interface GPURenderPipelineDescriptor extends GPUPipelineDescriptorBase {
  vertexStage: GPUPipelineStageDescriptor,
  fragmentStage: GPUPipelineStageDescriptor,
  primitiveTopology: string,
  rasterizationState: GPURasterizationStateDescriptor,
  colorStates: Array<GPUColorStateDescriptor>,
  //GPUDepthStencilStateDescriptor? depthStencilState;
  //GPUInputStateDescriptor inputState;
  sampleCount: number
}
