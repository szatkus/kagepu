import { KOperationError, ErrorReporter } from './errors'

export class KFence implements GPUFence {
  public _value?: number
  public label = 'fence'
  constructor (descriptor: GPUFenceDescriptor, private _errorReporter: ErrorReporter) {
    this._value = descriptor.initialValue
  }

  getCompletedValue (): number {
    return this._value ?? 0
  }

  async onCompletion (completionValue: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._value && this._errorReporter.validation()) {
        this._errorReporter.createValidationError('Fence not signaled.')
        reject(new KOperationError('Fence not signaled.'))
        return
      }
      let timeout = setInterval(() => {
        if (this._value! >= completionValue) {
          clearTimeout(timeout)
          resolve()
        }
      }, 1)
    })
  }
}
