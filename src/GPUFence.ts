import { GPUObjectDescriptorBase } from './interfaces'

export interface GPUFenceDescriptor extends GPUObjectDescriptorBase {
  initialValue?: number
}

export class GPUFence {
  _value: number
  constructor (descriptor: GPUFenceDescriptor) {
    this._value = descriptor.initialValue || 0
  }

  getCompletedValue (): number {
    return this._value
  }

  async onCompletion (completionValue: number): Promise<void> {
    return new Promise(resolve => {
      let timeout = setInterval(() => {
        if (this._value >= completionValue) {
          clearTimeout(timeout)
          resolve()
        }
      }, 1)
    })
  }
}
