export class KBindGroup implements GPUBindGroup {
  public label = 'bind-group'

  constructor (public _descriptor: GPUBindGroupDescriptor) {}
}

export class KBindGroupLayout implements GPUBindGroupLayout {
  public label = 'bind-group-layout'

  constructor (private _descriptor: GPUBindGroupLayoutDescriptor) {
  }

  _getBindingsByType (type: String): number[] {
    return (this._descriptor.bindings ?? []).filter(binding => binding.type === type).map(binding => binding.binding)
  }

  _getBindingsCount (): number {
    return (this._descriptor.bindings ?? []).length
  }
}
