export interface GPUCommandBuffer {}

export default interface GPUQueue {
    submit(buffers: Array<GPUCommandBuffer>): any
}
