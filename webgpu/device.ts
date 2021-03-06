import { KBuffer } from './buffers'
import { KTexture, KBufferTexture, KTextureView, extent3DToDict } from './textures'
import { KSampler } from './samplers'
import GPUCommandEncoder from './GPUCommandEncoder'
import { KBindGroupLayout, KBindGroup } from './bindGroups'
import KQueue from './KQueue'
import { KComputePipeline } from './compute'
import { ErrorReporter } from './errors'
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
  private _errorReporter = new ErrorReporter()
  public defaultQueue = new KQueue(this._errorReporter)

  constructor (public adapter: GPUAdapter) {
    if (this.adapter._brutal) {
      this._errorReporter.enableBrutalMode()
    }
  }

  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    let buffer = new KBuffer(descriptor)
    if (!buffer._isCorrect()) {
      this._errorReporter.createValidationError('Incorrect buffer.')
    }
    return buffer
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
    if (this._errorReporter.validation()) {
      if (descriptor.sampleCount !== undefined && descriptor.sampleCount !== 1 && descriptor.sampleCount !== 4) {
        this._errorReporter.createValidationError('Sample count is incorrect.')
      }
      if (descriptor.sampleCount === 4 && (descriptor.mipLevelCount ?? 1) > 1) {
        this._errorReporter.createValidationError('Mipmap is not supported when texture is sampled.')
      }
      if (descriptor.mipLevelCount === 0) {
        this._errorReporter.createValidationError('Mipmap level of 0 is not allowed.')
      }
      // let maxMipmapSize = Math.pow(2, (descriptor.mipLevelCount ?? 1) - 1)
      // let size = extent3DToDict(descriptor.size)
      // if (maxMipmapSize > size.width || maxMipmapSize > size.height) {
      //   this._errorReporter.createValidationError('Too high level of mipmap.')
      // }
      if (descriptor.format === 'r8snorm' || descriptor.format === 'rg8snorm' || descriptor.format === 'rgba8snorm' || descriptor.format === 'rg11b10float') {
        this._errorReporter.createValidationError('Color format is not renderable.')
      }
    }
    return new KBufferTexture(descriptor)
  }

  createSampler (descriptor: GPUSamplerDescriptor): GPUSampler {
    return new KSampler(descriptor)
  }

  createBindGroupLayout (descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    if (this._errorReporter.validation()) {
      let locations = new Set()
      let storageBuffers = 0
      let uniformBuffers = 0
      for (let layout of descriptor.bindings ?? []) {
        if (locations.has(layout.binding) || layout.binding < 0) {
          this._errorReporter.createValidationError('Incorrect binding.')
        }
        if (layout.type === 'storage-buffer') {
          storageBuffers++
        }
        if (layout.type === 'uniform-buffer') {
          uniformBuffers++
        }
        if (layout.hasDynamicOffset && layout.type !== 'storage-buffer' && layout.type !== 'readonly-storage-buffer' && layout.type !== 'uniform-buffer') {
          this._errorReporter.createValidationError('Dynamic offset is allowed only for buffers.')
        }
        locations.add(layout.binding)
      }
      if (storageBuffers > 4) {
        this._errorReporter.createValidationError('Too many storage buffers.')
      }
      if (uniformBuffers > 8) {
        this._errorReporter.createValidationError('Too many uniform buffers.')
      }
    }
    return new KBindGroupLayout(descriptor)
  }

  createPipelineLayout (descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    if (this._errorReporter.validation()) {
      let storageBuffers = 0
      let uniformBuffers = 0
      for (let layout of descriptor.bindGroupLayouts as KBindGroupLayout[]) {
        storageBuffers += layout._getBindingsByType('storage-buffer').length
        uniformBuffers += layout._getBindingsByType('uniform-buffer').length
      }
      if (storageBuffers > 4) {
        this._errorReporter.createValidationError('Too many storage buffers.')
      }
      if (uniformBuffers > 8) {
        this._errorReporter.createValidationError('Too many uniform buffers.')
      }
      if (descriptor.bindGroupLayouts.length > 4) {
        this._errorReporter.createValidationError('Too many bind group layouts.')
      }
    }
    return new KPipelineLayout(descriptor)
  }

  createShaderModule (descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new KShaderModule(descriptor.code)
  }

  createRenderPipeline (descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    if (this._errorReporter.validation()) {
      if (descriptor.sampleCount !== undefined && descriptor.sampleCount !== 1 && descriptor.sampleCount !== 4) {
        this._errorReporter.createValidationError('Sample count is incorrect.')
      }
      if (!descriptor.depthStencilState && descriptor.colorStates.length === 0) {
        this._errorReporter.createValidationError('At least one color state is required.')
      }
      for (let colorState of descriptor.colorStates) {
        if (colorState.format === 'r8snorm' || colorState.format === 'rg8snorm' || colorState.format === 'rgba8snorm' || colorState.format === 'rg11b10float' ||
            colorState.format === 'depth32float' || colorState.format === 'depth24plus' || colorState.format === 'depth24plus-stencil8') {
          this._errorReporter.createValidationError('Color format is not renderable.')
        }
      }
      if (descriptor.vertexState) {
        if ((descriptor.vertexState.vertexBuffers?.length ?? 0) > 16) {
          this._errorReporter.createValidationError('Too many vertex buffers.')
        }
        if ((descriptor.vertexState.vertexBuffers ?? []).map(v => v.attributes.length).reduce((a, b) => a + b, 0) > 16) {
          this._errorReporter.createValidationError('Too many attributes.')
        }
        let locations = new Set()
        for (let vertexBuffer of descriptor.vertexState.vertexBuffers || []) {
          if ((vertexBuffer.arrayStride ?? 0) > 2048) {
            this._errorReporter.createValidationError('Too large array stride.')
          }
          for (let attribute of vertexBuffer.attributes) {
            if ((vertexBuffer.arrayStride ?? 0) > 0 && attribute.offset >= vertexBuffer.arrayStride) {
              this._errorReporter.createValidationError('Attribute offset cannot exceed vertex buffer array stride.')
            }
            if (locations.has(attribute.shaderLocation)) {
              this._errorReporter.createValidationError('Multiple attributes in one location.')
            }
            locations.add(attribute.shaderLocation)
          }
        }
      }
    }
    return new KRenderPipeline(descriptor)
  }

  createComputePipeline (descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return new KComputePipeline(descriptor)
  }

  createBindGroup (descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    if (this._errorReporter.validation()) {
      let layout = descriptor.layout as KBindGroupLayout
      if (layout._getBindingsCount() !== descriptor.bindings.length) {
        this._errorReporter.createValidationError('Bindings count mismatch.')
      }
      for (let i = 0; i < descriptor.bindings.length; i++) {
        let binding = descriptor.bindings[i]
        let bindingLayout = layout._getBindings(i)
        if (binding.binding >= descriptor.bindings.length) {
          this._errorReporter.createValidationError('Incorrect binding location.')
        }
        let bufferBinding = binding.resource as GPUBufferBinding
        if (bufferBinding.buffer instanceof KBuffer) {
          if (!bufferBinding.buffer._isCorrect()) {
            this._errorReporter.createValidationError('Buffer is messed up.')
          }

          if (bindingLayout) {
            if (bindingLayout.type === 'uniform-buffer' && !bufferBinding.buffer._isUniform()) {
              this._errorReporter.createValidationError('Buffer is not uniform.')
            }
            if (bindingLayout.type === 'storage-buffer' && !bufferBinding.buffer._isStorage()) {
              this._errorReporter.createValidationError('Buffer is not storage.')
            }
            if (bindingLayout.type === 'readonly-storage-buffer' && !bufferBinding.buffer._isStorage() && !bufferBinding.buffer._isReadonly()) {
              this._errorReporter.createValidationError('Buffer is not correct.')
            }
            if (bindingLayout.type !== 'storage-buffer' && bindingLayout.type !== 'readonly-storage-buffer' && bindingLayout.type !== 'uniform-buffer') {
              this._errorReporter.createValidationError('Buffer is not a correct type.')
            }
          }

          if ((bufferBinding.offset ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength ||
            (bufferBinding.size ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength ||
            (bufferBinding.offset ?? 0) + (bufferBinding.size ?? 0) > bufferBinding.buffer._getArrayBuffer().byteLength) {
            this._errorReporter.createValidationError('Offset is misaligned.')
          }

          if (!(bufferBinding.offset === undefined && bufferBinding.size === undefined) &&
              bufferBinding.offset !== 0 && bufferBinding.size !== 0 &&
              (bufferBinding.offset ?? 0) % (bufferBinding.size ?? 0) !== 0) {
            this._errorReporter.createValidationError('Offset is misaligned.')
          }

          if ((bufferBinding.size ?? 0) < 0) {
            this._errorReporter.createValidationError('Offset is misaligned.')
          }
        }
        if (binding.resource instanceof KSampler && bindingLayout) {
          if (bindingLayout.type !== 'sampler') {
            this._errorReporter.createValidationError('Sampler is not a correct type.')
          }
          if (!binding.resource._isValid()) {
            this._errorReporter.createValidationError('Sampler is invalid.')
          }
        }
        if (binding.resource instanceof KTextureView && bindingLayout) {
          if (bindingLayout.type === 'sampled-texture' && !binding.resource._isSampled()) {
            this._errorReporter.createValidationError('Texture is not sampled.')
          }
          if (bindingLayout.type === 'storage-texture' && !binding.resource._isStorage()) {
            this._errorReporter.createValidationError('Texture is not storage.')
          }
          if (bindingLayout.type !== 'sampled-texture' && bindingLayout.type !== 'storage-texture') {
            this._errorReporter.createValidationError('Texture is not a correct type.')
          }
          if ((bindingLayout.textureComponentType === 'float' && binding.resource._getFormat().indexOf('unorm') === -1) ||
              (bindingLayout.textureComponentType === 'sint' && binding.resource._getFormat().indexOf('r8sint') === -1) ||
              (bindingLayout.textureComponentType === 'uint' && binding.resource._getFormat().indexOf('r8uint') === -1)) {
            this._errorReporter.createValidationError('Incorrect format.')
          }
          if (!binding.resource._isValid()) {
            this._errorReporter.createValidationError('Texture is invalid.')
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
    this._errorReporter.pushErrorScope(filter)
  }

  async popErrorScope (): Promise<GPUError | null> {
    return this._errorReporter.popErrorScope()
  }

  addEventListener (eventName: string, listener: Function, options: any) {
    this._errorReporter.addEventListener(eventName, listener, options)
  }

  /*
   * @deprecated
   */
  getQueue (): GPUQueue {
    return this.defaultQueue
  }

}

export class GPUAdapter {
  public name = 'kagegpu'
  public extensions = extensions

  constructor (public _brutal: boolean) {}

  async requestDevice (): Promise<GPUDevice> {
    return new GPUDevice(this)
  }
}
