import GPUAdapter from './GPUAdapter'
import { GPUBufferUsage, GPUShaderStage, GPUColorWriteBits, GPUTextureUsage } from './constants'
import GPUCanvasContext from './GPUCanvasContext';
import GPUValidationError from './GPUValidationError'

async function requestAdapter (): Promise<GPUAdapter> {
  return new GPUAdapter()
}

let gpu = {
  requestAdapter,
  GPUBufferUsage,
  monkeyPatch () {
    (window as any).GPUBufferUsage = GPUBufferUsage;
    // name has changed, but I leave it for near future
    (window as any).GPUShaderStageBit = GPUShaderStage;
    (window as any).GPUShaderStage = GPUShaderStage;
    (window as any).GPUColorWriteBits = GPUColorWriteBits;
    (window as any).GPUTextureUsage = GPUTextureUsage;
    (window as any).GPUValidationError = GPUValidationError;
    (window as any).GPUCanvasContext = GPUCanvasContext;
    (window.navigator as any).gpu = gpu;
    let originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as any).getContext = function (contextType: string, contextAttributes: any): any {
      if (contextType == 'gpu' || contextType == 'gpupresent') {
        let context = originalGetContext.apply(this, ['2d']) as CanvasRenderingContext2D
        return new GPUCanvasContext(context)
      }
      return originalGetContext.apply(this, [contextType, contextAttributes]);
    }
  }
}

export default gpu
