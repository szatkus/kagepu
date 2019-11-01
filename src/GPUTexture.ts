import { GPUTextureViewDescriptor, GPUTextureDescriptor } from './interfaces'
import GPUTextureView from './GPUTextureView'

export default class {
  constructor(protected descriptor?: GPUTextureDescriptor) {
    
  }
  createView (descriptor: GPUTextureViewDescriptor): GPUTextureView {
    return new GPUTextureView(this, descriptor)
  }
  createDefaultView (): GPUTextureView {
    return new GPUTextureView(this)
  }
  destroy () {

  }
};
