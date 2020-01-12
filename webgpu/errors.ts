
export class KValidationError implements GPUValidationError {
  constructor (public message: string) {}
}

export class KOutOfMemoryError implements GPUOutOfMemoryError {
  constructor (public message: string) {}
}

export class KUncapturedErrorEvent {
  error: GPUError
  constructor (error: GPUError) {
    this.error = error;
    (this as any).__proto__.__proto__ = new Event('uncapturederror', { bubbles: true, cancelable: false })
  }
}

class OperationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'OperationError'
  }
}

export class ErrorReporter {
  private error?: GPUError
  private filters: GPUErrorFilter[] = []
  private brutal = false
  private eventTarget = new EventTarget()

  createValidationError (message: string) {
    let error = new GPUValidationError(message)
    if (this.brutal) {
      throw error
    }
    if (this.filters.filter(s => s === 'validation').length > 0) {
      this.error = error
    } else {
      let errorEvent = new CustomEvent('uncapturederror');
      (errorEvent as any).error = error
      this.eventTarget.dispatchEvent(errorEvent as any)
    }
  }

  // TODO: OOM errors

  pushErrorScope (filter: GPUErrorFilter) {
    this.filters.push(filter)
  }

  popScopeInformations (): [GPUErrorFilter | undefined, Function | undefined] {
    let errorScope = this.filters.pop()
    let exceptedClass = errorScope === 'validation' ? KValidationError : errorScope === 'out-of-memory' ? KOutOfMemoryError : undefined
    return [errorScope, exceptedClass]
  }

  async popErrorScope (): Promise<GPUError | null> {
    let [errorScope, exceptedClass] = this.popScopeInformations()
    return new Promise((resolve, reject) => {
      if (!errorScope) {
        reject(new OperationError('No scopes.'))
      }
      if (!exceptedClass) {
        resolve(null)
        return
      }
      if (this.error instanceof exceptedClass) {
        let error = this.error
        delete this.error
        resolve(error)
        return
      }
      // TODO: implement something smarter
      setTimeout(() => {
        if (this.error instanceof exceptedClass!) {
          let error = this.error
          delete this.error
          resolve(error || null)
        } else {
          resolve(null)
        }
      }, 10)
    })
  }

  validation (): boolean {
    return this.filters[this.filters.length - 1] === 'validation' || this.brutal
  }

  addEventListener (eventName: string, listener: any, options: any) {
    this.eventTarget.addEventListener(eventName, listener, options)
  }

  enableBrutalMode () {
    this.brutal = true
  }
}
