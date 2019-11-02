import { Memory, InputMemory } from "./memory"
import dontKnow from "../dontKnow"
import { GPUPipelineStageDescriptor } from "../interfaces"
import { CompiledModule, compile } from "./compilation"

export class Execution {
    heap: any[] = []
    private functionMemory = new Memory(new ArrayBuffer(1024 * 4))
    private globalMemory = new Memory(new ArrayBuffer(1024 * 65))

    private constructor(private inputMemory: Memory, private outputMemory: Memory) {

    }

    private run(module: CompiledModule) {
        module.flow.forEach(f => f(this))
    }

    getMemorySubsystem(storageClass: number): Memory {
        if (storageClass === 1) {
            return this.inputMemory!
        }
        if (storageClass === 3) {
            return this.outputMemory
        }
        if (storageClass === 7) {
            return this.functionMemory
        }
        dontKnow()
        return this.getGlobalMemory()
    }
    getGlobalMemory(): Memory {
        return this.globalMemory
    }

    static start(input: Memory, output: Memory, module: CompiledModule) {
        let execution = new Execution(input, output)
        execution.run(module)
    }
}

export function executeShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: ArrayBuffer) {
    let inputMemory = new InputMemory(inputBuffer)
    let outputMemory = new Memory(new ArrayBuffer(1024 * 4))
    if (!vertexStage.module._spirvCode) {
        dontKnow()
    }
    let code = vertexStage.module._spirvCode!
    let compiled = <CompiledModule> vertexStage.module._compiled
    if (compiled == undefined) {
        compiled = compile(code)
        vertexStage.module._compiled = compiled
    }
    Execution.start(inputMemory, outputMemory, compiled)
    return outputMemory.float32View
}
