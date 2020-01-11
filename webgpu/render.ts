import { KBuffer } from './buffers'
import dontKnow from './dontKnow'

export interface KPUDrawStep {
  vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number
}

export interface KCommand {
  name: String,
  args: Array<any>
}

export class KRenderPipeline implements GPURenderPipeline {
  public label = 'render-pipeline'
  constructor (public _descriptor: GPURenderPipelineDescriptor) {

  }
}

export class KRenderPassEncoder implements GPURenderPassEncoder {
  public label = 'render-pass-encoder'
  popDebugGroup (): void {
    throw new Error('Method not implemented.')
  }
  pushDebugGroup (groupLabel: string): void {
    throw new Error('Method not implemented.')
  }
  insertDebugMarker (markerLabel: string): void {
    throw new Error('Method not implemented.')
  }
  drawIndirect (indirectBuffer: GPUBuffer, indirectOffset: number): void {
    throw new Error('Method not implemented.')
  }
  drawIndexedIndirect (indirectBuffer: GPUBuffer, indirectOffset: number): void {
    throw new Error('Method not implemented.')
  }
  setViewport (x: number, y: number, width: number, height: number, minDepth: number, maxDepth: number): void {
    throw new Error('Method not implemented.')
  }
  setScissorRect (x: number, y: number, width: number, height: number): void {
    throw new Error('Method not implemented.')
  }
  setStencilReference (reference: number): void {
    throw new Error('Method not implemented.')
  }
  executeBundles (bundles: GPURenderBundle[]): void {
    throw new Error('Method not implemented.')
  }

  private _isFinished = false
  constructor (descriptor: GPURenderPassDescriptor, public _commands: Array<KCommand>) {
    this._checkState()
    this._commands.push({
      name: 'setDescriptor',
      args: [descriptor]
    })
  }
  setPipeline (pipeline: GPURenderPipeline) {
    this._checkState()
    this._commands.push({
      name: 'setPipeline',
      args: [pipeline]
    })
  }
  setIndexBuffer (buffer: KBuffer, offset: number = 0) {
    this._checkState()
    buffer._lock()
    this._commands.push({
      name: 'setIndexBuffer',
      args: [buffer, offset]
    })
  }
  setVertexBuffer (slot: number, buffer: KBuffer, offset: number) {
    this._checkState()
    buffer._lock()
    this._commands.push({
      name: 'setVertexBuffer',
      args: [slot, buffer, offset]
    })
  }
  draw (vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
    if (instanceCount !== 1 || firstVertex !== 0 || firstInstance !== 0) {
      dontKnow()
    }
    this._checkState()
    this._commands.push({
      name: 'draw',
      args: [vertexCount, instanceCount, firstVertex, firstInstance]
    })
  }
  drawIndexed (indexCount: number, instanceCount: number, firstIndex: number, baseVertex: number, firstInstance: number) {
    this._checkState()
    this._commands.push({
      name: 'drawIndexed',
      args: [indexCount, instanceCount, firstIndex, baseVertex, firstInstance]
    })
  }
    // GPUProgrammablePassEncoder
  setBindGroup (index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
    this._checkState()
    if (dynamicOffsets) {
      dontKnow()
    }
    this._commands.push({
      name: 'setBindGroup',
      args: [index, bindGroup, dynamicOffsets]
    })
  }
  setBlendColor (color: GPUColor) {
    this._checkState()
    this._commands.push({
      name: 'setBlendColor',
      args: [color]
    })
  }
  endPass () {
    this._checkState()
    this._isFinished = true
  }
  _checkState () {
    if (this._isFinished) {
      throw new Error('Pass is finished.')
    }
  }
}
