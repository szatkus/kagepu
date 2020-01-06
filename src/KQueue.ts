import GPUQueue from './GPUQueue'
import { KCommandBuffer } from './GPUCommandEncoder'
import { GPURenderPipeline } from './GPURenderPipeline'
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor, GPUStoreOp } from './GPURenderPassEncoder'
import { GPUBindGroup } from './bindGroups'
import { GPUBuffer, GPUBufferSize } from './buffers'
import dontKnow from './dontKnow'
import { GPUInputStepMode, GPUIndexFormat, GPUComputePassDescriptor, GPUProgrammableStageDescriptor, GPUBufferCopyView, GPUTextureCopyView, GPUExtent3D, GPUVertexFormat, GPUOrigin3D } from './interfaces'
import { executeShader } from './spirv/execution'
import { GPUComputePipeline } from './GPUComputePipeline'
import { GPUFenceDescriptor, GPUFence } from './GPUFence'
import { GPUTexture } from './textures'
import { GPUColor, colorToNumber } from './colors'

export interface VertexInputs {
  buffer: ArrayBuffer,
  bindGroups: GPUBindGroup[],
  locations: {
    start: number,
    length: number
  }[],
  builtins: number[]
}

interface GPUOrigin2DDict {
  x: number,
  y: number
}

type GPUOrigin2D = number[] | GPUOrigin2DDict

interface GPUImageBitmapCopyView {
  imageBitmap: ImageBitmap,
  origin?: GPUOrigin2D
}

export default class KQueue implements GPUQueue {
  _pipeline?: GPURenderPipeline | GPUComputePipeline
  _indexBuffer = new ArrayBuffer(64)
  _vertexBuffers: ArrayBuffer[] = []
  _passDescriptor?: GPURenderPassDescriptor | GPUComputePassDescriptor
  _bindGroups: GPUBindGroup[] = []
  createFence (descriptor: GPUFenceDescriptor = { }): GPUFence {
    return new GPUFence(descriptor)
  }
  signal (fence: GPUFence, signalValue: number) {
    fence._value = signalValue
  }
  submit (buffers: KCommandBuffer[]) {
        // console.profile()
    for (let commandBuffer of buffers) {
      for (let command of commandBuffer._commands) {
        this._executeCommand(command)
      }
    }
        // console.profileEnd()
  }
  copyImageBitmapToTexture (source: GPUImageBitmapCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
    let origin: GPUOrigin2DDict = (source.origin as GPUOrigin2DDict) ?? { x: 0, y: 0 }
    let context = document.createElement('canvas').getContext('2d')
    context!.canvas.width = source.imageBitmap.width
    context!.canvas.height = source.imageBitmap.height
    context!.drawImage(source.imageBitmap, origin.x, origin.y)
    let imageData = context!.getImageData(0, 0, source.imageBitmap.width, source.imageBitmap.height)
    let destinationOrigin = destination.origin ?? { x: 0, y: 0, z: 0 }
    for (let x = 0; x < copySize.width!; x++) {
      for (let y = 0; y < copySize.height!; y++) {
        for (let z = 0; z < copySize.depth!; z++) {
          let offset = (y * imageData.width + x) * 4
          let pixel = imageData.data[offset] + imageData.data[offset + 1] * 0x100 + imageData.data[offset + 2] * 0x10000 + imageData.data[offset + 3] * 0x1000000
          destination.texture._putPixel(pixel,
            x + (destinationOrigin.x ?? 0),
            y + (destinationOrigin.y ?? 0),
            z + (destinationOrigin.z ?? 0),
            destination.arrayLayer ?? 0,
            destination.mipLevel ?? 0
          )
        }
      }
    }
  }
  async _runRenderPass (pass: GPURenderPassEncoder) {
    return new Promise((resolve, reject) => {
            // we don't want to hung a browser
      let commands = pass._commands
      let i = 0
      if (commands.length === 0) {
        return resolve()
      }
      let run = () => {
        try {
          let command = commands[i]
          this._executeCommand(command)
          i++
          if (i < commands.length) {
            setTimeout(run, 1)
          } else {
            resolve()
          }
        } catch (e) {
          reject(e)
        }
      }
      setTimeout(run, 1)
    })
  }
  _executeCommand (command: KCommand) {
    let methodName = '__command__' + command.name
    if (!(methodName in this)) {
      console.error('Missing command ' + command.name)
    }
    (this as any)[methodName].apply(this, command.args)
  }
  __command__setDescriptor (descriptor: GPURenderPassDescriptor | GPUComputePassDescriptor) {
    let defaultColor = { r: 0, b: 0, g: 0, a: 1 }
    let renderPassDescriptor = descriptor as GPURenderPassDescriptor
    for (let attachment of renderPassDescriptor.colorAttachments || []) {
      clear(attachment.attachment._texture, (attachment.loadValue as GPUColor) || defaultColor)
    }
    this._passDescriptor = descriptor
  }
  __command__setPipeline (pipeline: GPURenderPipeline) {
    this._pipeline = pipeline
  }
  __command__setIndexBuffer (buffer: GPUBuffer, offset: number) {
    this._indexBuffer = buffer._getArrayBuffer().slice(offset)
  }
  __command__setVertexBuffer (slot: number, buffer: GPUBuffer, offset: number) {
    this._vertexBuffers[slot] = buffer._getArrayBuffer().slice(offset)
  }
  __command__setBindGroup (index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
    this._bindGroups[index] = bindGroup
  }
  __command__copyBufferToBuffer (source: GPUBuffer, sourceOffset: GPUBufferSize, destination: GPUBuffer, destinationOffset: GPUBufferSize, size: GPUBufferSize) {
    let sourceView = new Uint8Array(source._mapWrite())
    let destinationView = new Uint8Array(destination._mapWrite())
    for (let i = 0; i < size; i++) {
      destinationView[destinationOffset + i] = sourceView[sourceOffset + i]
    }
  }
  __command__copyBufferToTexture (source: GPUBufferCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
    source = {
      ...{
        offset: 0
      },
      ...source
    }
    destination = {
      ...{
        mipLevel: 0,
        arrayLayer: 0,
        origin: { x: 0, y: 0, z: 0 }
      },
      ...destination
    }
    if (
            source.offset! !== 0 ||
            destination.origin!.x! !== 0 ||
            destination.origin!.y! !== 0 ||
            destination.origin!.z! !== 0
            ) {
      dontKnow()
    }
    if (
            !copySize.width ||
            !copySize.height ||
            !copySize.depth ||
            copySize.depth !== 1
            ) {
      dontKnow()
    }
    let view = source.buffer._getArray(destination.texture._getPixelSize())
    for (let x = 0; x < copySize.width!; x++) {
      for (let y = 0; y < copySize.height!; y++) {
        for (let z = 0; z < copySize.depth!; z++) {
          let pixel = view[z * source.imageHeight * source.rowPitch + source.rowPitch * y + x]
          destination.texture._putPixel(pixel, x, y, z, destination.arrayLayer!, destination.mipLevel!)
        }
      }
    }
  }
  __command__copyTextureToTexture (source: GPUTextureCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
    let arrayLayer = source.arrayLayer || 0
    let mipLevel = source.mipLevel || 0
    let origin = {
      x: 0,
      y: 0,
      z: 0,
      ...source.origin
    }
    if (arrayLayer !== 0 || mipLevel !== 0 || origin.x !== 0 || origin.y !== 0 || origin.z !== 0) {
      dontKnow()
    }
    if (destination.origin!.y !== 0) {
      dontKnow()
    }
    if (!copySize.width || !copySize.height || !copySize.depth) {
      dontKnow()
    }
    for (let x = 0; x < copySize.width!; x++) {
      for (let y = 0; y < copySize.height!; y++) {
        for (let z = 0; z < copySize.depth!; z++) {
          let pixel = source.texture._getPixel(x, y, z, arrayLayer, mipLevel)
          destination.texture._putPixel(pixel, x, y, z, destination.arrayLayer!, destination.mipLevel!)
        }
      }
    }
  }
  __command__copyTextureToBuffer (source: GPUTextureCopyView, destination: GPUBufferCopyView, copySize: GPUExtent3D) {
    let arrayLayer = source.arrayLayer || 0
    let mipLevel = source.mipLevel || 0
    let origin = {
      x: 0,
      y: 0,
      z: 0,
      ...source.origin
    }
    if (arrayLayer !== 0 || mipLevel !== 0 || origin.x !== 0 || origin.y !== 0 || origin.z !== 0) {
      dontKnow()
    }
    if (destination.offset) {
      dontKnow()
    }
    if (!copySize.width || !copySize.height || !copySize.depth) {
      dontKnow()
    }
    let view = destination.buffer._getArray(source.texture._getPixelSize())
    for (let x = 0; x < copySize.width!; x++) {
      for (let y = 0; y < copySize.height!; y++) {
        for (let z = 0; z < copySize.depth!; z++) {
          let pixel = source.texture._getPixel(x, y, z, arrayLayer, mipLevel)
          let offset = x + y * destination.rowPitch / view.BYTES_PER_ELEMENT + z * destination.imageHeight * destination.rowPitch / view.BYTES_PER_ELEMENT
          view[offset] = pixel
        }
      }
    }
  }
  __command__dispatch (x: number, y: number, z: number) {
    let pipeline = this._pipeline as GPUComputePipeline
    let inputBuffer = new ArrayBuffer(64)
    let inputs: VertexInputs = {
      buffer: inputBuffer,
      bindGroups: this._bindGroups,
      locations: [],
      builtins: []
    }
    executeComputeShader(pipeline._descriptor.computeStage, inputs)
  }
  __command__draw (vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
    let passDescriptor = this._passDescriptor! as GPURenderPassDescriptor
    let pipeline = (this._pipeline ? this._pipeline : dontKnow()) as GPURenderPipeline

    let offsets: number[] = []
    let vertexStage = pipeline._descriptor.vertexStage
    let verticiesData: any[] = []

    for (let i = 0; i < vertexCount; i++) {
      let inputBuffer = new ArrayBuffer(32)
      let inputBufferView = new Uint8Array(inputBuffer)
      let vertexInput: VertexInputs = {
        buffer: inputBuffer,
        bindGroups: this._bindGroups,
        locations: [],
        builtins: []
      }
      for (let j = 0; j < this._vertexBuffers.length; j++) {
        let offset = offsets[j] || 0
        let vertexBufferView = new Uint8Array(this._vertexBuffers[j])
        let vertexBufferInput = pipeline._descriptor.vertexState!.vertexBuffers![0]
        if (vertexBufferInput.stepMode && vertexBufferInput.stepMode !== 'vertex') {
          dontKnow()
        }
        for (let attribute of vertexBufferInput.attributes) {
          copyBytes(inputBufferView, attribute.offset, dataLength.get(attribute.format)!, vertexBufferView, offset + attribute.offset)
          vertexInput.locations.push({
            start: attribute.offset,
            length: dataLength.get(attribute.format)!
          })
        }
        offsets[j] = offset + vertexBufferInput.arrayStride
      }
      if (i > 255) dontKnow()
      vertexInput.builtins[42] = i
      verticiesData[i] = executeVertexShader(pipeline._descriptor.vertexStage, vertexInput)
    }
    for (let colorAttachment of passDescriptor.colorAttachments) {
      let output = colorAttachment.attachment._texture
      let storeMode = colorAttachment.storeOp ?? GPUStoreOp.STORE
      if (pipeline._descriptor.primitiveTopology !== 'triangle-list' || vertexCount % 3 !== 0) dontKnow()
      let width = output._getWidth()
      let height = output._getHeight()

      for (let i = 0; i < vertexCount / 3; i++) {
        for (let y = 0; y < output._getHeight(); y++) {
          for (let x = 0; x < output._getWidth(); x++) {

            let normalizedX = (x / width) * 2 - 1
            let normalizedY = ((height - y) / height) * 2 - 1
            const dir1 = checkDirection(normalizedX, normalizedY, verticiesData[0].position[0], verticiesData[0].position[1], verticiesData[1].position[0], verticiesData[1].position[1])
            const dir2 = checkDirection(normalizedX, normalizedY, verticiesData[2].position[0], verticiesData[2].position[1], verticiesData[1].position[0], verticiesData[1].position[1])
            const dir3 = checkDirection(normalizedX, normalizedY, verticiesData[0].position[0], verticiesData[0].position[1], verticiesData[2].position[0], verticiesData[2].position[1])
            if ((dir1 === -1 && dir2 === 1 && dir3 === -1) ||
            (dir1 === 0 && dir2 === 0) ||
            (dir1 === 0 && dir3 === 0) ||
            (dir2 === 0 && dir2 === 0)) {
              let inputBuffer = new ArrayBuffer(32)
              let pixelData = executeFragmentShader(pipeline._descriptor.fragmentStage, { buffer: inputBuffer, bindGroups: this._bindGroups, locations: [], builtins: [] })
                          // no idea what to do when a texture has more levels
              if (storeMode === GPUStoreOp.STORE) {
                output._putPixel(colorToNumber(pixelData.color), x, y, 0, 0, 0)
              }
            }
          }
        }
      }

      output._flush()
    }
  }
  __command__drawIndexed (indexCount: number, instanceCount: number, firstIndex: number, baseVertex: number, firstInstance: number) {
    let pipeline = (this._pipeline ? this._pipeline : dontKnow()) as GPURenderPipeline

    let offsets: number[] = []
    let vertexStage = pipeline._descriptor.vertexStage
    let vertexState = pipeline._descriptor.vertexState
    let verticiesData: any[] = []
    for (let i = 0; i < indexCount; i++) {
      let inputBuffer = new ArrayBuffer(64)
      let inputBufferView = new Uint8Array(inputBuffer)
      let lastPosition = 0
      let builtins = []
      builtins[42] = i
      let inputs: VertexInputs = {
        buffer: inputBuffer,
        bindGroups: this._bindGroups,
        locations: [],
        builtins
      }
      let vertexBuffers = vertexState?.vertexBuffers || []
      for (let j = 0; j < vertexBuffers.length; j++) {
        let descriptor = vertexBuffers[j]
        let indexBuffer = new Uint16Array(this._indexBuffer)
        let vertexBuffer = new Uint8Array(this._vertexBuffers[j])
        if (descriptor.stepMode !== GPUInputStepMode.vertex || vertexState!.indexFormat !== GPUIndexFormat.uint16 || descriptor.attributes.length > 1 || descriptor.attributes[0].offset !== 0) {
          dontKnow()
        }
        let index = indexBuffer[i]
        for (let k = 0; k < descriptor.arrayStride; k++) {
          inputBufferView[lastPosition] = vertexBuffer[index * descriptor.arrayStride + k]
          lastPosition++
        }
        inputs.locations[j] = {
          start: lastPosition - descriptor.arrayStride,
          length: descriptor.arrayStride
        }
      }
      verticiesData[i] = executeVertexShader(pipeline._descriptor.vertexStage, inputs)
      executeFragmentShader(pipeline._descriptor.fragmentStage, inputs)
      debugger
      throw new Error('ALT')
    }
  }
}

function checkDirection (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
  let yy = 0
  if (y2 === y3) {
    yy = y2
  } else {
    yy = y2 + ((x1 - x2) / (x3 - x2)) * (y3 - y2)
  }
  if (y1 > yy * 1.01) {
    return 1
  }
  if (y1 * 1.01 < yy) {
    return -1
  }
  return 0
}

function executeVertexShader (vertexStage: GPUProgrammableStageDescriptor, inputBuffer: VertexInputs) {
  let output = executeShader(vertexStage, inputBuffer)
  return {
    position: Array.from(output.slice(0, 4))
        // TODO: read te rest of output
  }
}

function executeFragmentShader (vertexStage: GPUProgrammableStageDescriptor, inputBuffer: VertexInputs) {
  let output = executeShader(vertexStage, inputBuffer)
  return {
    color: Array.from(output.slice(0, 4))
  }
}

function executeComputeShader (vertexStage: GPUProgrammableStageDescriptor, inputBuffer: VertexInputs) {
  executeShader(vertexStage, inputBuffer)
}

function copyBytes (output: Uint8Array, outputOffset: number, length: number, input: Uint8Array, inputOffset: number) {
  for (let i = 0; i < length; i++) {
    output[outputOffset + i] = input[inputOffset + i]
  }
}

const dataLength: Map<GPUVertexFormat, number> = new Map([[GPUVertexFormat.FLOAT4, 16]])

function clear (texture: GPUTexture, color: GPUColor) {
  for (let arrayLayer = 0; arrayLayer < texture._getArrayLayerCount(); arrayLayer++) {
    for (let mipmapLevel = 0; mipmapLevel < texture._getMipmapLevelCount(); mipmapLevel++) {
      for (let x = 0; x < texture._getWidth(); x++) {
        for (let y = 0; y < texture._getHeight(); y++) {
          for (let z = 0; z < texture._getDepth(); z++) {
            texture._putPixel(colorToNumber(color), x, y, z, arrayLayer, mipmapLevel)
          }
        }
      }
    }
  }
}
