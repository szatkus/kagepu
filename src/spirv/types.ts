import dontKnow from "../dontKnow"

export class Type {
    getSize(): number {
        dontKnow()
        return 0
    }
}
export class TypeVoid extends Type {}

export class TypeFunction extends Type {
    constructor(public type: Type, public types: Array<Type>) {
        super()
    }
}

export class TypeInt extends Type {
    constructor(public width: number, public signed: boolean) {
        super()
        if (width != 32 && width != 64) {
            dontKnow()
        }
    }

    getSize(): number {
        return this.width / 8
    }
}

export class TypeVector extends Type {
    constructor(public type: Type, public count: number) {
        super()
    }

    getSize(): number {
        return this.type.getSize() * this.count
    }
}

export class TypeMatrix extends Type {
    rows: number
    type: Type
    constructor(public vectorType: TypeVector, public columns: number) {
        super()
        this.rows = vectorType.count
        this.type = vectorType.type
    }

    getSize(): number {
        return this.vectorType.getSize() * this.columns
    }
}

export class TypeFloat extends Type {
    constructor(public width: number) {
        super()
        if (width != 32 && width != 64) {
            dontKnow()
        }
        // TODO: what could go wrong if float is too precise?
    }

    getSize(): number {
        return this.width / 8
    }
}

export class TypePointer extends Type {
    constructor(public storageClass: number, public type: Type) {
        super()
    }
}

export class TypeArray extends Type {
    constructor( public type: Type, public count: number) {
        super()
    }

    getSize(): number {
        return this.type.getSize() * this.count
    }
}

export class TypeStruct extends Type {
    constructor(public members: Type[]) {
        super()
    }

    getSize(): number {
        return this.members.reduce((a, t) => a + t.getSize(), 0)
    }
}

import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpTypeVoid
        case 19:
            {
                let resultId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    execution.heap[resultId] = new TypeVoid
                })
                console.debug(`$${resultId} = OpTypeVoid`)
                state.processed = true
            }
        break
        // OpTypeInt
        case 21:
            {
                let resultId = state.consumeWord()
                let width = state.consumeWord()
                let signed = state.consumeWord() == 1
                module.flow.push((execution: Execution) => {
                    execution.heap[resultId] = new TypeInt(width, signed)
                })
                console.debug(`$${resultId} = OpTypeInt ${width}  ${signed}`)
                state.processed = true
            }
        break
        // OpTypeFloat
        case 22:
            {
                let resultId = state.consumeWord()
                let width = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    execution.heap[resultId] = new TypeFloat(width)
                })
                console.debug(`$${resultId} = OpTypeFloat ${width}`)
                state.processed = true
            }
        break
        // OpTypeVector
        case 23:
            {
                let resultId = state.consumeWord()
                let typeId = state.consumeWord()
                let count = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = new TypeVector(type, count)
                })
                console.debug(`$${resultId} = OpTypeVector $${typeId} ${count}`)
                state.processed = true
            }
        break
        // OpTypeMatrix
        case 24:
            {
                let resultId = state.consumeWord()
                let typeId = state.consumeWord()
                let count = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <TypeVector> execution.heap[typeId]
                    execution.heap[resultId] = new TypeMatrix(type, count)
                })
                console.debug(`$${resultId} = OpTypeMatrix $${typeId} ${count}`)
                state.processed = true
            }
        break
        // OpTypeArray
        case 28:
            {
                let resultId = state.consumeWord()
                let typeId = state.consumeWord()
                let count = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = new TypeArray(type, count)
                })
                console.debug(`$${resultId} = OpTypeArray $${typeId} ${count}`)
                state.processed = true
            }
        break
        // OpTypeStruct
        case 30:
            {
                let resultId = state.consumeWord()
                let typeIds: number[] = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let types = typeIds.map(t => execution.heap[t])
                    execution.heap[resultId] = new TypeStruct(types)
                })
                console.debug(`$${resultId} = OpTypeStruct ${typeIds}`)
                state.processed = true
            }
        break
        // OpTypePointer
        case 32:
            {
                let resultId = state.consumeWord()
                let storageClass = state.consumeWord()
                let typeId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = new TypePointer(storageClass, type)
                })
                console.debug(`$${resultId} = OpTypePointer ${storageClass} $${typeId}`)
                state.processed = true
            }
        break
        // OpTypeFunction
        case 33:
            {
                let resultId = state.consumeWord()
                let typeId = state.consumeWord()
                let argumentsIds = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = new TypeFunction(type, argumentsIds.map(id => <Type> execution.heap[id]))
                })
                console.debug(`$${resultId} = OpTypeFunction $${typeId}`)
                state.processed = true
            }
        break
    }
}
