import { GPUPipelineDescriptorBase, GPURasterizationStateDescriptor, GPUColorStateDescriptor, GPUVertexStateDescriptor, GPUProgrammableStageDescriptor } from './interfaces'

export interface GPURenderPipelineDescriptor extends GPUPipelineDescriptorBase {
  vertexStage: GPUProgrammableStageDescriptor ,
  fragmentStage: GPUProgrammableStageDescriptor ,
  primitiveTopology: string,
  rasterizationState?: GPURasterizationStateDescriptor,
  colorStates: Array<GPUColorStateDescriptor>,
    // GPUDepthStencilStateDescriptor? depthStencilState;
    // GPUInputStateDescriptor inputState;
  vertexState?: GPUVertexStateDescriptor,
  sampleCount: number,
  sampleMask: number,
  alphaToCoverageEnabled: boolean
}

export class GPURenderPipeline {
  constructor (public _descriptor: GPURenderPipelineDescriptor) {

  }
}
