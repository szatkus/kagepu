export class KSampler implements GPUSampler {
  label = 'sampler'

  constructor (private _descriptor: GPUSamplerDescriptor = {}) {}

  public _isValid (): boolean {
    if ((this._descriptor.lodMinClamp ?? 0) < 0) {
      return false
    }
    if ((this._descriptor.lodMaxClamp ?? 0xffffffff) > 0xffffffff) {
      return false
    }
    return true
  }
}
