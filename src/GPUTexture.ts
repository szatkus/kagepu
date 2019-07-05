import { GPUTextureViewDescriptor, GPUTextureDescriptor } from './interfaces'
import GPUTextureView from './GPUTextureView'

export default class {
  constructor(private descriptor?: GPUTextureDescriptor) {
    
  }
  createView (descriptor: GPUTextureViewDescriptor): GPUTextureView {
    return new GPUTextureView(descriptor)
  }
  createDefaultView (): GPUTextureView {
    return new GPUTextureView()
  }
  destroy () {

  }
};
