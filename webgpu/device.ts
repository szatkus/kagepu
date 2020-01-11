import { KBuffer } from './buffers'
import { KTexture, KBufferTexture, KTextureView } from './textures'
import { KSampler } from './samplers'
import GPUCommandEncoder from './GPUCommandEncoder'
import { KBindGroupLayout, KBindGroup } from './bindGroups'
import KQueue from './KQueue'
import { KComputePipeline } from './compute'
import { KValidationError } from './errors'
import { GPURenderBundleEncoder } from './GPURenderBundleEncoder'
import { KShaderModule } from './shaders'
import { KRenderPipeline } from './render'

export const extensions = {
  anisotropicFiltering: false
}
export const limits = {
  maxBindGroups: 8
}

export class KPipelineLayout implements GPUPipelineLayout {
  public label = 'pipeline-layout'
  constructor (public _descriptor: GPUPipelineLayoutDescriptor) {

  }
}

export class GPUDevice {
  public extensions = extensions
  public limit = limits
  public adapter: GPUAdapter
  private _filters: GPUErrorFilter = 'none'
  private _error?: GPUError
  public defaultQueue = new KQueue()

  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }

  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    return new KBuffer(descriptor)
  }

  createBufferMapped (descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new KBuffer(descriptor, true)
    return [buffer, buffer._mapWrite()]
  }

  /*
   * @deprecated
   */
  async createBufferMappedAsync (descriptor: GPUBufferDescriptor): Promise<[GPUBuffer, ArrayBuffer]> {
    return this.createBufferMapped(descriptor)
  }

  createTexture (descriptor: GPUTextureDescriptor): GPUTexture {
    return new KBufferTexture(descriptor)
  }

  createSampler (descriptor: GPUSamplerDescriptor): GPUSampler {
    return new KSampler()
  }

  createBindGroupLayout (descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    if (this._validation()) {
      let locations = new Set()
      let storageBuffers = 0
      let uniformBuffers = 0
      for (let layout of descriptor.bindings ?? []) {
        if (locations.has(layout.binding) || layout.binding < 0) {
          this._error = new GPUValidationError('Incorrect binding.')
        }
        if (layout.type === 'storage-buffer') {
          storageBuffers++
        }
        if (layout.type === 'uniform-buffer') {
          uniformBuffers++
        }
        if (layout.hasDynamicOffset && layout.type !== 'storage-buffer' && layout.type !== 'readonly-storage-buffer' && layout.type !== 'uniform-buffer') {
          this._error = new GPUValidationError('Dynamic offset is allowed only for buffers.')
        }
        locations.add(layout.binding)
      }
      if (storageBuffers > 4) {
        this._error = new GPUValidationError('Too many storage buffers.')
      }
      if (uniformBuffers > 8) {
        this._error = new GPUValidationError('Too many uniform buffers.')
      }
    }
    return new KBindGroupLayout(descriptor)
  }

  createPipelineLayout (descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    if (this._validation()) {
      let storageBuffers = 0
      let uniformBuffers = 0
      for (let layout of descriptor.bindGroupLayouts as KBindGroupLayout[]) {
        storageBuffers += layout._getBindingsByType('storage-buffer').length
        uniformBuffers += layout._getBindingsByType('uniform-buffer').length
      }
      if (storageBuffers > 4) {
        this._error = new GPUValidationError('Too many storage buffers.')
      }
      if (uniformBuffers > 8) {
        this._error = new GPUValidationError('Too many uniform buffers.')
      }
      if (descriptor.bindGroupLayouts.length > 4) {
        this._error = new GPUValidationError('Too many bind group layouts.')
      }
    }
    return new KPipelineLayout(descriptor)
  }

  createShaderModule (descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new KShaderModule(descriptor.code)
  }

  createRenderPipeline (descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    if (this._validation() && descriptor.vertexState) {
      if ((descriptor.vertexState.vertexBuffers?.length ?? 0) > 16) {
        this._error = new GPUValidationError('Too many vertex buffers.')
      }
      if ((descriptor.vertexState.vertexBuffers ?? []).map(v => v.attributes.length).reduce((a, b) => a + b, 0) > 16) {
        this._error = new GPUValidationError('Too many attributes.')
      }
      let locations = new Set()
      for (let vertexBuffer of descriptor.vertexState.vertexBuffers || []) {
        if ((vertexBuffer.arrayStride ?? 0) > 2048) {
          this._error = new GPUValidationError('Too large array stride.')
        }
        for (let attribute of vertexBuffer.attributes) {
          if ((vertexBuffer.arrayStride ?? 0) > 0 && attribute.offset >= vertexBuffer.arrayStride) {
            this._error = new GPUValidationError('Attribute offset cannot exceed vertex buffer array stride.')
          }
          if (locations.has(attribute.shaderLocation)) {
            this._error = new GPUValidationError('Multiple attributes in one location.')
          }
          locations.add(attribute.shaderLocation)
        }
      }
    }
    return new KRenderPipeline(descriptor)
  }

  createComputePipeline (descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return new KComputePipeline(descriptor)
  }

  createBindGroup (descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    if (this._validation()) {
      let layout = descriptor.layout as KBindGroupLayout
      if (layout._getBindingsCount() !== descriptor.bindings.length) {
        this._error = new GPUValidationError('Bindings count mismatch.')
      }
      for (let i = 0; i < descriptor.bindings.length; i++) {
        let binding = descriptor.bindings[i]
        let bindingLayout = layout._getBindings(i)
        if (binding.binding >= descriptor.bindings.length) {
          this._error = new GPUValidationError('Incorrect binding location.')
        }
        let bufferBinding = binding.resource as GPUBufferBinding
        if (bufferBinding.buffer instanceof KBuffer) {
          if (!bufferBinding.buffer._isCorrect()) {
            this._error = new GPUValidationError('Buffer is messed up.')
          }

          if (bindingLayout) {
            if (bindingLayout.type === 'uniform-buffer' && !bufferBinding.buffer._isUniform()) {
              this._error = new GPUValidationError('Buffer is not uniform.')
            }
            if (bindingLayout.type === 'storage-buffer' && !bufferBinding.buffer._isStorage()) {
              this._error = new GPUValidationError('Buffer is not storage.')
            }
            if (bindingLayout.type === 'readonly-storage-buffer' && !bufferBinding.buffer._isStorage() && !bufferBinding.buffer._isReadonly()) {
              this._error = new GPUValidationError('Buffer is not correct.')
            }
            if (bindingLayout.type !== 'storage-buffer' && bindingLayout.type !== 'readonly-storage-buffer' && bindingLayout.type !== 'uniform-buffer') {
              this._error = new GPUValidationError('Buffer is not a correct type.')
            }
          }

          if ((bufferBinding.offset ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength ||
            (bufferBinding.size ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength ||
            (bufferBinding.offset ?? 0) + (bufferBinding.size ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength) {
            this._error = new GPUValidationError('Offset is misaligned.')
          }

          if (!(bufferBinding.offset === undefined && bufferBinding.size === undefined) &&
              bufferBinding.offset !== 0 && bufferBinding.size !== 0 &&
              (bufferBinding.offset ?? 0) % (bufferBinding.size ?? 0) !== 0) {
            this._error = new GPUValidationError('Offset is misaligned.')
          }

          if ((bufferBinding.size ?? 0) < 0) {
            this._error = new GPUValidationError('Offset is misaligned.')
          }
        }
        if (binding.resource instanceof KSampler && bindingLayout) {
          if (bindingLayout.type !== 'sampler') {
            this._error = new GPUValidationError('Sampler is not a correct type.')
          }
        }
        if (binding.resource instanceof KTextureView && bindingLayout) {
          if (bindingLayout.type === 'sampled-texture' && !binding.resource._isSampled()) {
            this._error = new GPUValidationError('Texture is not sampled.')
          }
          if (bindingLayout.type === 'storage-texture' && !binding.resource._isStorage()) {
            this._error = new GPUValidationError('Texture is not storage.')
          }
          if (bindingLayout.type !== 'sampled-texture' && bindingLayout.type !== 'storage-texture') {
            this._error = new GPUValidationError('Texture is not a correct type.')
          }
          if ((bindingLayout.textureComponentType === 'float' && binding.resource._getFormat().indexOf('unorm') === -1) ||
              (bindingLayout.textureComponentType === 'sint' && binding.resource._getFormat().indexOf('r8sint') === -1) ||
              (bindingLayout.textureComponentType === 'uint' && binding.resource._getFormat().indexOf('r8uint') === -1)) {
            this._error = new GPUValidationError('Incorrect format.')
          }
          if (binding.resource._texture._getArrayLayerCount() !== 1) {
            this._error = new GPUValidationError('Incorrect dimensions.')
          }
        }
      }
    }
    return new KBindGroup(descriptor)
  }

  createCommandEncoder (descriptor?: any): GPUCommandEncoder {
    return new GPUCommandEncoder()
  }

  createRenderBundleEncoder (descriptor: GPURenderBundleEncoderDescriptor): GPURenderBundleEncoder {
    return new GPURenderBundleEncoder(descriptor)
  }

  pushErrorScope (filter: GPUErrorFilter) {
    this._filters = filter
  }

  async popErrorScope (): Promise<GPUError | null> {
    let error = this._error
    delete this._error
    return error || null
  }

  /*
   * @deprecated
   */
  getQueue (): GPUQueue {
    return this.defaultQueue
  }

  _validation (): boolean {
    return this._filters === 'validation'
  }
}

export class GPUAdapter {
  name = 'kagegpu'
  extensions = extensions

  async requestDevice (): Promise<GPUDevice> {
    return new GPUDevice(this)
  }
}
