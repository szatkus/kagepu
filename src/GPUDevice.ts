import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'
import { GPUBufferDescriptor } from './interfaces';
import GPUBuffer from './GPUBuffer';

export default class {
  extensions = extensions
  limit = limits
  adapter: GPUAdapter
  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer {
    return new GPUBuffer(descriptor, false)
  }
}
