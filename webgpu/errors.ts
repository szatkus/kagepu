
export class KValidationError implements GPUValidationError {
  constructor (public message: string) {}
}

export class KOutOfMemoryError implements GPUOutOfMemoryError {
  constructor (public message: string) {}
}

export class ErrorReporter {
  private error?: GPUError
  filter: GPUErrorFilter = 'none'

  createValidationError (message: string) {
    this.error = new GPUValidationError(message)
  }

  // TODO: OOM errors

  pushErrorScope (filter: GPUErrorFilter) {
    this.filter = filter
  }

  async popErrorScope (): Promise<GPUError | null> {
    let error = this.error
    delete this.error
    return error || null
  }

  validation (): boolean {
    return this.filter === 'validation'
  }
}
