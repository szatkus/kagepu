export interface GPUCommandBuffer {}

export default class GPUQueue {
    submit(buffers: Array<GPUCommandBuffer>) {
        console.debug(buffers)
    }
}
