import { GPURenderPassEncoder, KCommand } from './GPURenderPassEncoder'
import { GPUBufferSize, KBuffer } from './buffers'
import { GPUComputePassEncoder } from './GPUComputePassEncoder'

export class KCommandBuffer implements GPUCommandBuffer {
  label = 'command-buffer'
  constructor (public _commands: KCommand[]) {}
}

export default class GPUCommandEncoder {
  private _isFinished = false
  private _commands: Array<KCommand> = []

  beginRenderPass (descriptor: GPURenderPassDescriptor): GPURenderPassEncoder {
    this._checkState()
    return new GPURenderPassEncoder(descriptor, this._commands)
  }

  beginComputePass (descriptor: GPUComputePassDescriptor = { label: '' }): GPUComputePassEncoder {
    this._checkState()
    return new GPUComputePassEncoder(descriptor, this._commands)
  }

  finish (descriptor?: any): GPUCommandBuffer {
    if (descriptor) {
      throw new Error('not supported yet')
    }
    this._isFinished = true
    return new KCommandBuffer(this._commands)
  }

  copyBufferToBuffer (source: GPUBuffer, sourceOffset: GPUBufferSize, destination: GPUBuffer, destinationOffset: GPUBufferSize, size: GPUBufferSize) {
    this._checkState();
    (source as KBuffer)._lock();
    (destination as KBuffer)._lock()
    this._commands.push({
      name: 'copyBufferToBuffer',
      args: [source, sourceOffset, destination, destinationOffset, size]
    })
  }

  copyBufferToTexture (source: GPUBufferCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
    let buffer = source.buffer as KBuffer
    this._checkState()
    buffer._lock()
    this._commands.push({
      name: 'copyBufferToTexture',
      args: [source, destination, copySize]
    })
  }

  copyTextureToBuffer (source: GPUTextureCopyView, destination: GPUBufferCopyView, copySize: GPUExtent3D) {
    let buffer = destination.buffer as KBuffer
    this._checkState()
    buffer._lock()
    this._commands.push({
      name: 'copyTextureToBuffer',
      args: [source, destination, copySize]
    })
  }

  copyTextureToTexture (source: GPUTextureCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
    this._checkState()
    this._commands.push({
      name: 'copyTextureToTexture',
      args: [source, destination, copySize]
    })
  }

  _checkState () {
    if (this._isFinished) {
      throw new Error('Pass is finished.')
    }
  }
}