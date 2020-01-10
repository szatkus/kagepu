import { KCommand } from './GPURenderPassEncoder'
import dontKnow from './dontKnow'

export class GPURenderBundleEncoder {
  private _isFinished = false
  public _commands: KCommand[] = []

  constructor (private _descriptor: GPURenderBundleEncoderDescriptor) {

  }

  setBindGroup (index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
    this._checkState()
    if (dynamicOffsets) {
      dontKnow()
    }
    this._commands.push({
      name: 'setBindGroup',
      args: [index, bindGroup, dynamicOffsets]
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
