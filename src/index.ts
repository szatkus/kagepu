import GPUAdapter from './GPUAdapter'
import { GPUBufferUsage } from './constants'

export default {
  async requestAdapter (): Promise<GPUAdapter> {
    return new GPUAdapter()
  },
  GPUBufferUsage
}
