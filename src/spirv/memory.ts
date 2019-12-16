import dontKnow from "../dontKnow"
import { Type, TypeInt, TypeVector, TypeArray, TypeStruct, TypePointer, TypeMatrix, TypeFloat } from "./types"
import { CompilationState, CompiledModule } from "./compilation"
import { Execution } from "./execution"
import { VertexInputs } from "../KQueue"
import { Decorations, Location } from "./annotations"

export class Pointer {
    constructor(public memory: Memory, public address: number, public type: Type) {
        if (type == undefined) {
            debugger
        }
    }

    read(): number[] {
        return Array.from(this.memory.read(this))
    }

    readFloat32Array(): Float32Array {
        return this.memory.readFloat32Array(this.address, this.type.getSize())
    }

    readFloat32(): number {
        return this.memory.readFloat32(this.address)
    }

    readInt32(): number {
        return this.memory.readInt32(this.address)
    }

    readUint32(): number {
        return this.memory.readUint32(this.address)
    }

    readValue(): number {
        if (this.type instanceof TypeInt && this.type.width == 32) {
            if (this.type.signed) {
                return this.readInt32()
            } else {
                return this.readUint32()
            }
        }
        dontKnow()
        return 0
    }

    getIndex(index: number): Pointer {
        if (this.type instanceof TypeVector || this.type instanceof TypeArray) {
            let address = this.address + index * this.type.type.getSize()
            return new Pointer(this.memory, address, this.type.type)
        }
        if (this.type instanceof TypeStruct) {
            let address = this.address
            for (let i = 0; i < index; i++) {
                address += this.type.members[i].getSize()
            }
            return new Pointer(this.memory, address, this.type.members[index])
        }
        if (this.type instanceof TypeMatrix) {
            let address = this.address + this.type.vectorType.getSize() * index
            return new Pointer(this.memory, address, this.type.vectorType)
        }
        dontKnow()
        return this
    }

    setIndex(index: number, data: number[]) {
        this.getIndex(index).write(data)
    }

    write(data: number[]) {
        this.memory.write(this, data)
    }

    writeUint32(value: number) {
        this.memory.writeUint32(this.address, value)
    }

    toString(): String {
        if (this.type instanceof TypeFloat && this.type.width === 32) {
            return this.memory.readFloat32(this.address).toString()
        }

        if (this.type instanceof TypeInt && this.type.width === 32 && this.type.signed) {
            return this.memory.readInt32(this.address).toString()
        }

        if (this.type instanceof TypeInt && this.type.width === 32 && !this.type.signed) {
            return this.memory.readUint32(this.address).toString()
        }

        if (this.type instanceof TypeVector || this.type instanceof TypeArray) {
            let result = []
            for (let i = 0; i < this.type.count; i++) {
                result.push(new Pointer(this.memory, this.address + this.type.type.getSize() * i, this.type.type).toString())
            }
            return result.join(', ')
        }

        if (this.type instanceof TypeStruct) {
            let result = []
            let address = this.address
            for (let i = 0; i < this.type.members.length; i++) {
                result.push(new Pointer(this.memory, address, this.type.members[i]).toString())
                address += this.type.members[i].getSize()
            }
            return result.join(', ')
        }

        if (this.type instanceof TypeMatrix) {
            let result = ''
            for (let r = 0; r < this.type.rows; r++) {
                let row = []
                for (let c = 0; c < this.type.columns; c++) {
                    row.push(new Pointer(this.memory, this.address + c * this.type.vectorType.getSize() + r * this.type.type.getSize(), this.type.type).toString())
                }
                result += '[ ' + row.join(', ') + ' ]\n'
            }
            return result
        }
        return ''
    }
}

export class Memory {
    lastFree = 0
    uint8View: Uint8Array
    uint32View: Uint32Array
    int32View: Int32Array
    float32View: Float32Array
    constructor(public memory: ArrayBuffer) {
        this.uint8View = new Uint8Array(this.memory)
        this.uint32View = new Uint32Array(this.memory)
        this.int32View = new Int32Array(this.memory)
        this.float32View = new Float32Array(this.memory)
    }

    allocateMemory(size: number): number {
        if (size < 1) dontKnow()
        // alignment
        if (this.lastFree % size != 0) {
            this.lastFree += this.lastFree % size
        }
        let pointer = this.lastFree
        this.lastFree += size
        if (this.lastFree > this.memory.byteLength) {
            throw new Error("Out of memory")
        }
        return pointer
    }

    clear() {
        this.int32View.fill(0)
        this.lastFree = 0
    }

    createVariable(type: Type, resultId: number): Pointer {
        let address = this.allocateMemory(type.getSize())
        let pointer = new Pointer(this, address, type)
        return pointer
    }

    read(pointer: Pointer): Uint8Array {
        return this.uint8View.slice(pointer.address, pointer.address + pointer.type.getSize())
    }

    readFloat32Array(address: number, length: number): Float32Array {
        return this.float32View.slice(address / 4, (address + length) / 4)
    }

    readFloat32(address: number): number {
        return this.float32View[address / 4]
    }

    readInt32(address: number): number {
        return this.int32View[address / 4]
    }

    readUint32(address: number): number {
        return this.uint32View[address / 4]
    }

    write(pointer: Pointer, data: number[]) {
        if (data.length > pointer.type.getSize()) dontKnow()
        for (let i = 0; i < data.length; i++) {
            this.uint8View[pointer.address + i] = data[i]
        }
    }

    writeUint32(address: number, value: number) {
        this.uint32View[address / 4] = value
    }
}

export class InputMemory extends Memory {
    constructor(private inputs: VertexInputs, private decorations: Decorations) {
        super(inputs.buffer)
    }

    allocateMemory(size: number) {
        throw new Error("Input memory is read-only.")
        return 0
    }

    store(pointer: Pointer, value: number[]) {
        throw new Error("Input memory is read-only.")
    }

    clear() {
        throw new Error("Input memory is read-only.")
    }

    write(pointer: Pointer, data: number[]) {
        throw new Error("Input memory is read-only.")
    }

    writeUint32(address: number, value: number) {
        throw new Error("Input memory is read-only.")
    }

    createVariable(type: Type, resultId: number, value: number[] = []): Pointer {
        if (value.length > 0) {
            dontKnow()
        }
        let decoration: Location = this.decorations.getSingleDecoration(resultId, Location)
        if (!decoration) {
            dontKnow()
        }
        let start = this.inputs.locations[decoration.value].start
        return new Pointer(this, start, type)
    }

}

export class ConstantComposite {
    constructor(public type: Type, public constituents: number[]) {}
}


export function compile (state: CompilationState, module: CompiledModule) {
    function getData(object: any, heap: any[]): number[] {
        let result: number[] = []
        if (object instanceof ConstantComposite) {
            for (let c of object.constituents) {
                result = result.concat(getData(heap[c], heap))
            }
            return result
        }
        if (object instanceof Pointer) {
            return object.read()
        }
        dontKnow()
        return []
    }
    switch(state.opCode) {
        // OpVariable
        case 59:
            {
                if (state.wordCount > 4) dontKnow()
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                let storageClass = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let pointerType = <TypePointer> execution.heap[typeId]
                    let type = pointerType.type
                    let pointer = execution.getMemorySubsystem(storageClass).createVariable(type, resultId)
                    execution.heap[resultId] = pointer
                })
                console.debug(`$${resultId} = OpVariable $${typeId} ${storageClass}`)
                state.processed = true
            }
        break
        // OpLoad
        case 61:
            {
                if (state.wordCount > 4) dontKnow()
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                let loadId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = execution.heap[loadId]
                })
                console.debug(`$${resultId} = OpLoad ${typeId} $${loadId}`)
                state.processed = true
            }
        break
        // OpStore
        case 62:
            {
                if (state.wordCount > 4) dontKnow()
                let pointerId = state.consumeWord()
                let objectId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let pointer = execution.heap[pointerId]
                    let object = execution.heap[objectId]
                    let data = getData(object, execution.heap)
                    pointer.write(data)
                })
                console.debug(`OpStore $${pointerId} $${objectId}`)
                state.processed = true
            }
        break
        // OpAccessChain
        case 65:
            {
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                let baseId = state.consumeWord()
                let indexes = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let type = <TypePointer> execution.heap[typeId]
                    let base = execution.heap[baseId]
                    indexes.forEach(i => {
                        let index = execution.heap[i].readValue()
                        base = base.getIndex(index)
                    })
                    execution.heap[resultId] = base
                })
                
                console.debug(`$${resultId} = OpAccessChain $${typeId} $${baseId} ${indexes}`)
                state.processed = true
            }
        break
    }
}
