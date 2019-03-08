import { GPUTextureViewDescriptor } from './interfaces'

export default class GPUTextureView {
    descriptor?: any // TODO: try to fix type issue
    constructor (descriptor?: GPUTextureViewDescriptor) {
      this.descriptor = { ...descriptor }
    }
}
