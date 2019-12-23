import { Memory, InputMemory, Pointer, ConstantMemory } from "./memory"
import dontKnow from "../dontKnow"
import { GPUProgrammableStageDescriptor } from "../interfaces"
import { CompiledModule, compile } from "./compilation"
import { VertexInputs } from "../KQueue"
import { FunctionDeclaration, FunctionEnd } from "./functions"
import { Decorations, Binding, DescriptorSet } from "./annotations"
import { GPUBufferBinding, GPUBindGroup, GPUBindGroupBinding } from "../bindGroups"
import { Type } from "./types"
import { imiToWasm } from "./imi"

let functionMemoryPool: Memory[] = []
let globalMemoryPool: Memory[] = []

interface Frame {
    func: FunctionDeclaration
    args: any[]        
}

export class Execution {
    
    private heap: any[] = []
    private heapSnapshot: String[] = []
    private functionMemory: Memory
    private globalMemory: Memory
    private constantMemory: Memory
    inFunction: number = 0
    private functions: Map<Number, FunctionDeclaration> = new Map()
    currentFrame?: Frame
    frames: Array<Frame> = []
    returnedValue: any

    private constructor(private inputMemory: Memory, private outputMemory: Memory, private storageBuffers: Memory) {
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

        this.constantMemory = new ConstantMemory(inputMemory, this.globalMemory);
    }

    private prerun(module: CompiledModule) {
        for (let i = 0; i < module.flow.length; i++) {
            let func = module.flow[i]
            if (func instanceof Function) {
                func(this)
            }
            // this.compareSnapshots()
            if (this.inFunction !== 0) {
                let currentFunction = <FunctionDeclaration> this.heap[this.inFunction]
                i++
                while (module.flow[i] && !(module.flow[i] instanceof FunctionEnd)) {
                    currentFunction.body.push(<Function> module.flow[i])
                    i++
                } 
                this.functions.set(this.inFunction, currentFunction)
                this.inFunction = 0
            }
        }
    }

    getMemorySubsystem(storageClass: number): Memory {
        if (storageClass === 0) {
            return this.constantMemory
        }
        if (storageClass === 1) {
            return this.inputMemory
        }
        if (storageClass === 2 || storageClass === 0) {
            return this.globalMemory
        }
        if (storageClass === 3) {
            return this.outputMemory
        }
        if (storageClass === 7) {
            return this.functionMemory
        }
        if (storageClass === 12) {
            return this.storageBuffers
        }
        dontKnow()
        return this.getGlobalMemory()
    }

    getGlobalMemory(): Memory {
        return this.globalMemory
    }

    get(resultId: number): any {
        return this.heap[resultId]
    }

    put(resultId: number, object: any) {
        this.heap[resultId] = object
    }

    static start(input: Memory, output: Memory, storageBuffer: Memory, module: CompiledModule, entryPoint: string) {
        let execution = new Execution(input, output, storageBuffer)
        execution.prerun(module)
        let startFunction = execution.functions.get(module.entryPoints.get(entryPoint)!)!
        execution.callFunction(startFunction)
        functionMemoryPool.push(execution.functionMemory)
        globalMemoryPool.push(execution.globalMemory)
    }

    callFunction(func: FunctionDeclaration, args: any[] = []) {
        this.currentFrame = {
            func,
            args
        }
        this.frames.push(this.currentFrame)
        for (let i = 0; i < func.body.length; i++) {
            func.body[i](this)
            // this.compareSnapshots()
        }
        return this.returnedValue
    }

    compareSnapshots() {
        for (let j = 0; j < this.heap.length; j++) {
            if (this.heap[j] && this.heap[j].toString() != this.heapSnapshot[j]) {
                console.debug(`$${j} = ${this.heap[j].toString()}`)
            }
            if (this.heap[j]) {
                this.heapSnapshot[j] = this.heap[j].toString()
            } else {
                this.heapSnapshot[j] = this.heap[j]
            }
        }
    }
}

class StorageBufferMemory extends Memory {
    constructor(private inputs: VertexInputs, private decorations: Decorations) {
        super(new ArrayBuffer(0))
        inputs.bindGroups.forEach((bindingGroup: GPUBindGroup) => {
            let validBindings = bindingGroup.descriptor.layout._getBindingsByType('storage-buffer')

        })
    }
    createVariable(type: Type, resultId: number): Pointer {
        let binding = <Binding> this.decorations.getSingleDecoration(resultId, Binding)
        let descriptorSet = <DescriptorSet> this.decorations.getSingleDecoration(resultId, DescriptorSet)
        let validBindings = this.inputs.bindGroups[descriptorSet.value].descriptor.layout._getBindingsByType('storage-buffer')
        if (validBindings.indexOf(binding.value) === -1) {
            dontKnow()
        }
        let perfectBinding = this.inputs.bindGroups[descriptorSet.value].descriptor.bindings.filter((g: GPUBindGroupBinding) => g.binding === binding.value)[0]
        let buffer = <GPUBufferBinding> perfectBinding.resource
        if (!buffer.buffer || buffer.offset! > 0) {
            dontKnow()
        }
        return new Pointer(buffer.buffer._useAsMemory(), 0, type)
    }
}

export function executeShader(vertexStage: GPUProgrammableStageDescriptor, inputs: VertexInputs) {
    if (!vertexStage.module._spirvCode) {
        dontKnow()
    }
    let code = vertexStage.module._spirvCode!
    let compiled = <CompiledModule> vertexStage.module._compiled
    if (compiled == undefined) {
        compiled = compile(code)
        vertexStage.module._compiled = compiled
    }
    let inputMemory = new InputMemory(inputs, compiled.decorations)
    let storageBuffer = new StorageBufferMemory(inputs, compiled.decorations)
    let outputMemory = new Memory(new ArrayBuffer(1024 * 4))
    Execution.start(inputMemory, outputMemory, storageBuffer, compiled, vertexStage.entryPoint)
    return outputMemory.float32View
}
