import { GPUBufferDescriptor } from './interfaces'
import { GPUBufferUsage } from './constants'

export default class {
  _data: ArrayBuffer
  _usage: number
  _mapped = false
  _destroyed = false
  constructor (descriptor: GPUBufferDescriptor) {
    this._data = new ArrayBuffer(descriptor.size)
    this._usage = descriptor.usage
  }
  setSubData (offset: number, data: ArrayBuffer) {
    if (!(this._usage & GPUBufferUsage.TRANSFER_DST)) {
      // ERROR: validation error
    }
    if (!(offset + data.byteLength <= this._data.byteLength)) {
      // ERROR: validation error
    }
    if (this._mapped || this._destroyed) {
      // ERROR: validation error
    }
    // TODO: alignment
    let input = new Uint8Array(data)
    let output = new Uint8Array(this._data)
    for (let i = 0; i < data.byteLength; i++) {
      output[offset + i] = input[i]
    }
  }
  async mapReadAsync (): Promise<ArrayBuffer> {
    this._mapped = true
    return this._data.slice(0)
  }
  async mapWriteAsync (): Promise<ArrayBuffer> {
    this._mapped = true
    return this._data
  }
  unmap () {
    this._mapped = false
  }
  destroy () {
    this._destroyed = false
  }
}
