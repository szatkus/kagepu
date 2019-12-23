import { KCommand } from './GPURenderPassEncoder'
import { GPUComputePassDescriptor } from './interfaces'
import { GPUComputePipeline } from './GPUComputePipeline'
import { GPUBindGroup } from './bindGroups'

export class GPUComputePassEncoder {

  private _isFinished = false
  constructor (descriptor: GPUComputePassDescriptor, public _commands: KCommand[]) {
    this._checkState()
    this._commands.push({
      name: 'setDescriptor',
      args: [descriptor]
    })
  }
  setPipeline (pipeline: GPUComputePipeline) {
    this._checkState()
    this._commands.push({
      name: 'setPipeline',
      args: [pipeline]
    })
  }
  setBindGroup (index: number, bindGroup: GPUBindGroup, dynamicOffsets: number[] = []) {
    this._checkState()
    this._commands.push({
      name: 'setBindGroup',
      args: [index, bindGroup, dynamicOffsets]
    })
  }
  dispatch (x: number, y: number = 1, z: number = 1) {
    this._checkState()
    this._commands.push({
      name: 'dispatch',
      args: [1, 1, 1]
    })
  }
  endPass () {
    this._checkState()
    this._isFinished = true
  }
  _checkState () {
    if (this._isFinished) {
      throw new Error('Pass is finished.')
    }
  }
}
