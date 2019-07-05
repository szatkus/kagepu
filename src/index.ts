import GPUAdapter from './GPUAdapter'
import { GPUBufferUsage } from './constants'
import GPUCanvasContext from './GPUCanvasContext';

async function requestAdapter (): Promise<GPUAdapter> {
  return new GPUAdapter()
}

let gpu = {
  requestAdapter,
  GPUBufferUsage,
  monkeyPatch () {
    (window as any).GPUBufferUsage = GPUBufferUsage;
    (window.navigator as any).gpu = gpu;
    let originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as any).getContext = function (contextType: string, contextAttributes: any): any {
      if (contextType == 'gpu') {
        return new GPUCanvasContext()
      }
      return originalGetContext.apply(this, [contextType, contextAttributes]);
    }
  }
}

export default gpu
