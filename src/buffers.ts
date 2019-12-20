import { GPUBufferDescriptor } from './interfaces'
import { GPUBufferUsage } from './constants'
import dontKnow from './dontKnow';

export type GPUBufferSize = number;

let worker = new Worker('data:application/javascript,')

export class GPUBuffer {
  _data: ArrayBuffer | undefined
  _error: Error | undefined
  _usage: number
  _mapped = false
  _destroyed = false
  _toDetach: Array<ArrayBuffer> = []
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
    if (!(this._usage & GPUBufferUsage.COPY_DST)) {
      // ERROR: validation error
      debugger
    }
    if (!(offset + data.byteLength <= this._data!.byteLength)) {
      // ERROR: validation error
      debugger
    }
    if (this._mapped || this._destroyed) {
      // ERROR: validation error
      debugger
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
    let dataCopy = this._data!.slice(0)
    this._toDetach.push(dataCopy)
    return <ArrayBuffer> Object.freeze(dataCopy)
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
    let oldData = this._data!
    this._data = oldData.slice(0)
    this._mapped = false
    this._toDetach.push(oldData)
    worker.postMessage('detach', this._toDetach)
    this._toDetach = []
  }
  destroy () {
    this._destroyed = false
    this._toDetach.push(this._data!)
    worker.postMessage('detach', this._toDetach)
    this._toDetach = []
  }
}
