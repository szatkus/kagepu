import { GPUTextureViewDescriptor } from './interfaces'
import GPUTexture from './GPUTexture'

export default class GPUTextureView {
    descriptor?: any // TODO: try to fix type issue
    constructor (public _texture: GPUTexture, descriptor?: GPUTextureViewDescriptor) {
      this.descriptor = { ...descriptor }
    }
}
