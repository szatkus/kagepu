import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";

export default class KQueue implements GPUQueue {
    submit(buffers: Array<KCommandBuffer>) {
        console.debug(buffers)
    }
}
