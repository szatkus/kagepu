import { Memory, InputMemory } from "./memory"
import dontKnow from "../dontKnow"
import { GPUPipelineStageDescriptor } from "../interfaces"
import { CompiledModule, compile } from "./compilation"
import { VertexInputs } from "../KQueue"

let functionMemoryPool: Memory[] = []
let globalMemoryPool: Memory[] = []

export class Execution {
    heap: any[] = []
    private functionMemory: Memory
    private globalMemory: Memory

    private constructor(private inputMemory: Memory, private outputMemory: Memory) {
        if (functionMemoryPool.length > 0) {
            this.functionMemory = functionMemoryPool.pop()!
            this.functionMemory.clear()
        } else {
            this.functionMemory = new Memory(new ArrayBuffer(1024 * 4))
        }
        if (globalMemoryPool.length > 0) {
            this.globalMemory = globalMemoryPool.pop()!
            this.globalMemory.clear()
        } else {
            this.globalMemory = new Memory(new ArrayBuffer(1024 * 65))
        }
    }

    private run(module: CompiledModule) {
        module.flow.forEach(f => f(this))
    }

    getMemorySubsystem(storageClass: number): Memory {
        if (storageClass === 1) {
            return this.inputMemory!
        }
        if (storageClass === 2) {
            return this.globalMemory
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
        functionMemoryPool.push(execution.functionMemory)
        globalMemoryPool.push(execution.globalMemory)
    }
}

export function executeShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: VertexInputs) {
    if (!vertexStage.module._spirvCode) {
        dontKnow()
    }
    let code = vertexStage.module._spirvCode!
    let compiled = <CompiledModule> vertexStage.module._compiled
    if (compiled == undefined) {
        compiled = compile(code)
        vertexStage.module._compiled = compiled
    }
    let inputMemory = new InputMemory(inputBuffer, compiled.decorations)
    let outputMemory = new Memory(new ArrayBuffer(1024 * 4))
    Execution.start(inputMemory, outputMemory, compiled)
    return outputMemory.float32View
}
