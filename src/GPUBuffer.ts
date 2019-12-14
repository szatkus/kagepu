import { GPUBufferDescriptor } from './interfaces'
import { GPUBufferUsage } from './constants'
import dontKnow from './dontKnow';

export type GPUBufferSize = number;

export default class {
  _data: ArrayBuffer | undefined
  _error: Error | undefined
  _usage: number
  _mapped = false
  _destroyed = false
  constructor (descriptor: GPUBufferDescriptor) {
    try {
      this._data = new ArrayBuffer(descriptor.size)
    } catch (e) {
      this._error = e
    }
    this._usage = descriptor.usage
  }
  // deprecated
  setSubData (offset: number, data: ArrayBuffer, srcOffset: number = 0, length: number = 0) {
    if (this._error) {
      throw this._error
    }
    if (!(data instanceof ArrayBuffer)) {
      data = (data as any).buffer
    }
    if (length === 0) {
      length = this._data!.byteLength
    }
    if (srcOffset !== 0 || length != this._data!.byteLength) {
      dontKnow()
    }
    if (!(this._usage & GPUBufferUsage.TRANSFER_DST)) {
      // ERROR: validation error
    }
    if (!(offset + data.byteLength <= this._data!.byteLength)) {
      // ERROR: validation error
    }
    if (this._mapped || this._destroyed) {
      // ERROR: validation error
    }
    // TODO: alignment
    let input = new Uint8Array(data)
    let output = new Uint8Array(this._data!)
    for (let i = 0; i < data.byteLength; i++) {
      output[offset + i] = input[i]
    }
  }
  _mapRead (): ArrayBuffer {
    if (this._error) {
      throw this._error
    }
    this._mapped = true
    return this._data!.slice(0)
  }
  async mapReadAsync (): Promise<ArrayBuffer> {
    return this._mapRead()
  }
  _mapWrite(): ArrayBuffer {
    if (this._error) {
      throw this._error
    }
    this._mapped = true
    return this._data!
  }
  async mapWriteAsync(): Promise<ArrayBuffer> {
    return this._mapWrite()
  }
  unmap () {
    this._mapped = false
  }
  destroy () {
    this._destroyed = false
  }
}
