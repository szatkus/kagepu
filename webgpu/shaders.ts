import { GPUShaderCode } from './interfaces'
import { CompiledModule } from '../spirv'

const SPIRV_MAGIC_NUMBER = Number.parseInt('0x07230203')

export const GPUShaderStage = {
  NONE: 0,
  VERTEX: 1,
  FRAGMENT: 2,
  COMPUTE: 4
}

export class KShaderModule implements GPUShaderModule {
  _spirvCode?: Uint32Array
  _compiled?: CompiledModule
  public label = 'shader-module'
  constructor (code: GPUShaderCode) {
    if (code[0] === SPIRV_MAGIC_NUMBER) {
      this._spirvCode = code as Uint32Array
    }
  }
}
