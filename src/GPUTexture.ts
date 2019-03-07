import { GPUTextureViewDescriptor } from './interfaces'
import GPUTextureView from './GPUTextureView'

export default class {
  createView (descriptor: GPUTextureViewDescriptor): GPUTextureView {
    return new GPUTextureView(descriptor)
  }
  createDefaultView (): GPUTextureView {
    return new GPUTextureView()
  }
  destroy () {

  }
};
