import { GPUBindGroupLayoutDescriptor } from "./interfaces";

export default class {
    constructor(private _descriptor: GPUBindGroupLayoutDescriptor) {
    }
    _getBindingsByType(type: String): number[] {
        return this._descriptor.bindings.filter(binding => binding.type === type).map(binding => binding.binding)
    }
    _getBindingsCount(): number {
        return this._descriptor.bindings.length
    }
}
