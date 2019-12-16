import { GPUPipelineDescriptorBase, GPUProgrammableStageDescriptor } from "./interfaces";

export interface GPUComputePipelineDescriptor extends GPUPipelineDescriptorBase {
    computeStage: GPUProgrammableStageDescriptor
}

export class GPUComputePipeline {
    constructor(public _descriptor: GPUComputePipelineDescriptor) {
        
    }
}
