
export class KValidationError implements GPUValidationError {
  constructor (public message: string) {}
}

export class KOutOfMemoryError implements GPUOutOfMemoryError {
  constructor (public message: string) {}
}
