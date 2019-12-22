import GPUPipelineLayout from './GPUPipelineLayout';
import GPUShaderModule from './GPUShaderModule';
import { GPUBufferSize, GPUBuffer } from './buffers';
import GPUBindGroupLayout from './GPUBindGroupLayout';
import { GPUTexture } from './textures';

export interface GPUObjectDescriptorBase {
  label?: string
}

export interface GPUBufferDescriptor {
  size: number,
  usage: number
}

export interface dupa {
  size: number,
  usage: number
}

export interface GPUExtent3D {
  width?: number,
  height?: number,
  depth?: number
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

export type GPUShaderCode = Uint32Array|string

export interface GPUShaderModuleDescriptor {
  code: GPUShaderCode
}

export interface GPUPipelineLayoutDescriptor {
  bindGroupLayouts: Array<GPUBindGroupLayout>
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
  alphaBlend?: string,
  colorBlend?: string,
  writeMask?: string
}

export enum GPUInputStepMode {
  vertex = "vertex",
  instance = "instance"
}

export enum GPUVertexFormat {
  // "uchar2",
  // "uchar4",
  // "char2",
  // "char4",
  // "uchar2norm",
  // "uchar4norm",
  // "char2norm",
  // "char4norm",
  // "ushort2",
  // "ushort4",
  // "short2",
  // "short4",
  // "ushort2norm",
  // "ushort4norm",
  // "short2norm",
  // "short4norm",
  // "half2",
  // "half4",
  // "float",
  // "float2",
  // "float3",
  FLOAT4 = 'float4',
  // "uint",
  // "uint2",
  // "uint3",
  // "uint4",
  // "int",
  // "int2",
  // "int3",
  // "int4"
}

export interface GPUVertexAttributeDescriptor {
  offset: number,
  format: GPUVertexFormat,
  shaderLocation: number
}

export interface GPUVertexBufferDescriptor {
  stride: number,
  stepMode: GPUInputStepMode,
  attributeSet: GPUVertexAttributeDescriptor[]
};

export interface GPUVertexBufferDescriptor {

}

export interface GPUVertexInputDescriptor {
  vertexBuffers: GPUVertexBufferDescriptor[]
}

export enum GPUIndexFormat {
  uint16 = "uint16",
  uint32 = "uint32"
}

export interface GPUVertexBufferLayoutDescriptor {
  arrayStride: GPUBufferSize,
  stepMode?: GPUInputStepMode,
  attributes: Array<GPUVertexAttributeDescriptor>
}

export interface GPUVertexStateDescriptor {
  indexFormat: GPUIndexFormat,
  vertexBuffers: Array<GPUVertexBufferLayoutDescriptor>
}

export interface GPUComputePassDescriptor extends GPUObjectDescriptorBase {

}

export interface GPUProgrammableStageDescriptor {
  module: GPUShaderModule
  entryPoint: string
}

export interface GPUBufferCopyView {
  buffer: GPUBuffer, 
  offset?: GPUBufferSize,
  rowPitch: number,
  imageHeight: number,
};

export interface GPUOrigin3D {
  x?: number,
  y?: number,
  z?: number
}

export interface GPUTextureCopyView {
  texture: GPUTexture,
  mipLevel?: number,
  arrayLayer?: number,
  origin?: GPUOrigin3D;
}

