import GPUDevice from './GPUDevice'
import { extensions } from './constants'

export default class {
  name = 'kagegpu'
  extensions = extensions

  async requestDevice () : Promise<GPUDevice> {
    return new GPUDevice(this)
  }
}
