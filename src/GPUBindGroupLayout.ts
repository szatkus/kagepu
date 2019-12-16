import { GPUBindGroupLayoutDescriptor } from "./interfaces";

export default class {
    constructor(private descriptor: GPUBindGroupLayoutDescriptor) {
        this.descriptor = descriptor
    }
    _getBindingsByType(type: String): number[] {
        return this.descriptor.bindings.filter(binding => binding.type === type).map(binding => binding.binding)
    }
}
