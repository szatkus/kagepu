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
    return new GPUBuffer(descriptor)
  }
  createBufferMapped(descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new GPUBuffer(descriptor)
    buffer.mapped = true
    return [buffer, buffer.data]
  }
  async createBufferMappedAsync(descriptor: GPUBufferDescriptor): Promise<[GPUBuffer, ArrayBuffer]> {
    return this.createBufferMapped(descriptor)
  }
}
