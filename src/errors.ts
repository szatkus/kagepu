

export class GPUError {
  constructor(readonly message: String) {}
}

export class GPUValidationError extends GPUError {
    constructor(message: String) {
        super(message)
    }
}

export class GPUOutOfMemoryError extends GPUError {
    constructor(message: String) {
        super(message)
    }
}

export enum GPUErrorFilter {
  NONE = 'none',
  OUT_OF_MEMORY = 'out-of-memory',
  VALIDATION = 'validation'
};
