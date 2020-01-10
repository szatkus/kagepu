import kagegpu from '../webgpu/index'

import { expect } from 'chai'
import 'mocha'

describe('GPUBuffer', () => {
  it('test buffer operations', async () => {
    let adapter = await kagegpu.requestAdapter()
    let device = await adapter.requestDevice()
    let buffer = device.createBuffer({
      size: 128,
      usage: GPUBufferUsage.COPY_DST
    })
    let array = new Uint8Array(64)
    array[0] = 43
    array[13] = 72
    array[63] = 221
    buffer.setSubData(64, array)
    let readBuffer = await buffer.mapReadAsync()
    let readArray = new Uint8Array(readBuffer)
    expect(readArray[64]).to.equal(43)
    expect(readArray[77]).to.equal(72)
    expect(readArray[127]).to.equal(221)
  })

  it('test mapped buffer', async () => {
    let adapter = await kagegpu.requestAdapter()
    let device = await adapter.requestDevice()
    let [buffer, array] = device.createBufferMapped({
      size: 128,
      usage: GPUBufferUsage.COPY_DST
    })
    expect((buffer as any)._mapped).to.be.true
  })
})
