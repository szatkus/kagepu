import GPUAdapter from './GPUAdapter'

export default {
  async requestAdapter (): Promise<GPUAdapter> {
    return new GPUAdapter()
  }
}
