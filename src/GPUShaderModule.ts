import { GPUShaderCode } from "./interfaces";

const SPIRV_MAGIC_NUMBER = Number.parseInt('0x07230203')

export default class {
    _spirvCode?: Uint32Array
    _compiled?: any
    constructor (code: GPUShaderCode) {
        if (code[0] == SPIRV_MAGIC_NUMBER) {
            this._spirvCode = code as Uint32Array
        }
    }
}
