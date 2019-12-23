import { GPUFenceDescriptor, GPUFence } from './GPUFence'

export interface GPUCommandBuffer {}

export default interface GPUQueue {
  submit (buffers: Array<GPUCommandBuffer>): any
  createFence (descriptor: GPUFenceDescriptor): GPUFence
}
