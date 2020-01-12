import dontKnow from './dontKnow'
import { Memory } from '../spirv/memory'

export type GPUBufferSize = number

let worker = new Worker('data:application/javascript,')

export const KBufferUsage = {
  MAP_READ:  0x0001,
  MAP_WRITE: 0x0002,
  COPY_SRC:  0x0004,
  COPY_DST:  0x0008,
  INDEX:     0x0010,
  VERTEX:    0x0020,
  UNIFORM:   0x0040,
  STORAGE:   0x0080,
  INDIRECT:  0x0100
}

export class KBuffer implements GPUBuffer {
  private _data: ArrayBuffer | undefined
  private _error: Error | undefined
  private _usage: number
  private _destroyed = false
  private _toDetach: Array<ArrayBuffer> = []
  private _locks = 0
  private _monitors: Function[] = []
  public label = 'buffer'
  constructor (descriptor: GPUBufferDescriptor, private _mapped = false) {
    try {
      this._data = new ArrayBuffer(descriptor.size)
    } catch (e) {
      this._error = e
    }
    this._usage = descriptor.usage
  }

  /*
   * deprecated
   */
  setSubData (offset: number, data: ArrayBufferView, srcOffset: number = 0, length: number = 0) {
    if (this._error) {
      throw this._error
    }
    if (!(data instanceof ArrayBuffer)) {
      data = (data as any).buffer
    }
    if (length === 0) {
      length = this._data!.byteLength
    }
    if (srcOffset !== 0 || length !== this._data!.byteLength) {
      dontKnow()
    }
    if (!(this._usage & KBufferUsage.COPY_DST)) {
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
    let input = new Uint8Array(data.buffer || data)
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
    return Object.freeze(dataCopy) as ArrayBuffer
  }

  async mapReadAsync (): Promise<ArrayBuffer> {
    if (this._locks === 0) {
      return this._mapRead()
    } else {
      return new Promise<ArrayBuffer>(resolve => {
        this._monitors.push(() => resolve(this._mapRead()))
      })
    }
  }

  _isCorrect (): boolean {
    if (this._usage & KBufferUsage.INDEX && this._usage & KBufferUsage.VERTEX) {
      return false
    }
    return true
  }

  _isUniform (): boolean {
    return !!(this._usage & KBufferUsage.UNIFORM)
  }

  _isStorage (): boolean {
    return !!(this._usage & KBufferUsage.STORAGE)
  }

  _isReadonly () {
    return (this._usage & KBufferUsage.MAP_READ) && !(this._usage & KBufferUsage.MAP_WRITE)
  }

  _mapWrite (): ArrayBuffer {
    if (this._error) {
      throw this._error
    }
    this._mapped = true
    return this._data!
  }

  async mapWriteAsync (): Promise<ArrayBuffer> {
    if (this._locks === 0) {
      return this._mapWrite()
    } else {
      return new Promise<ArrayBuffer>(resolve => {
        this._monitors.push(() => resolve(this._mapWrite()))
      })
    }
  }

  _lock () {
    this._locks++
  }

  _unlock () {
    this._locks--
    if (this._locks === 0) {
      let monitor = this._monitors.pop()
      while (monitor) {
        monitor.apply(this)
        monitor = this._monitors.pop()
      }
    }
  }

  _useAsMemory (): Memory {
    if (this._error) {
      throw this._error
    }
    return new Memory(this._data!)
  }

  _getArray (width: number): Uint8Array | Uint16Array | Uint32Array {
    if (this._error) {
      throw this._error
    }
    if (width === 8) {
      return new Uint8Array(this._data!)
    }
    if (width === 16) {
      return new Uint16Array(this._data!)
    }
    return new Uint32Array(this._data!)
  }

  _getArrayBuffer (): ArrayBuffer {
    if (this._error) {
      throw this._error
    }
    return this._data!
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
