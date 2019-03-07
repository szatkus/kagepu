import { GPUBufferDescriptor } from './interfaces'
import { GPUBufferUsage } from './constants'

export default class {
  data: ArrayBuffer
  usage: number
  mapped = false
  destroyed = false
  constructor (descriptor: GPUBufferDescriptor) {
    this.data = new ArrayBuffer(descriptor.size)
    this.usage = descriptor.usage
  }
  setSubData (offset: number, data: ArrayBuffer) {
    if (!(this.usage & GPUBufferUsage.TRANSFER_DST)) {
      // ERROR: validation error
    }
    if (!(offset + data.byteLength <= this.data.byteLength)) {
      // ERROR: validation error
    }
    if (this.mapped || this.destroyed) {
      // ERROR: validation error
    }
    // TODO: alignment
    let input = new Uint8Array(data)
    let output = new Uint8Array(this.data)
    for (let i = 0; i < data.byteLength; i++) {
      output[offset + i] = input[i]
    }
  }
  async mapReadAsync (): Promise<ArrayBuffer> {
    this.mapped = true
    return this.data.slice(0)
  }
  async mapWriteAsync (): Promise<ArrayBuffer> {
    this.mapped = true
    return this.data
  }
  unmap () {
    this.mapped = false
  }
  destroy () {
    this.destroyed = false
  }
}
