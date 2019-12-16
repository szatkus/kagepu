import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";
import { TypeVector, TypeFloat } from "./types";
import { Pointer, Memory } from "./memory";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFAdd
        case 129:
            {
                let resultTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperandId = state.consumeWord()
                let rightOperandId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let resultType = execution.heap[resultTypeId]
                    let leftOperand = <Pointer> execution.heap[leftOperandId]
                    let rightOperand = <Pointer> execution.heap[rightOperandId]
                    let count = resultType instanceof TypeVector ? resultType.count : 1
                    let result = new Float32Array(count)
                    let leftVectorData = leftOperand.readFloat32Array()
                    let rightVectorData = rightOperand.readFloat32Array()
                    for (let i = 0; i < resultType.count; i++) {
                        result[i] = leftVectorData[i] + rightVectorData[i]
                    }
                    execution.heap[resultId] = new Pointer(new Memory(result.buffer), 0, resultType)
                })
                console.debug(`$${resultTypeId} = OpFAdd $${leftOperandId} $${rightOperandId}`)
                state.processed = true
            }
        break
        // OpFSub
        case 131:
            {
                let resultTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperandId = state.consumeWord()
                let rightOperandId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let resultType = execution.heap[resultTypeId]
                    let leftOperand = <Pointer> execution.heap[leftOperandId]
                    let rightOperand = <Pointer> execution.heap[rightOperandId]
                    let count = resultType instanceof TypeVector ? resultType.count : 1
                    let result = new Float32Array(count)
                    let leftVectorData = leftOperand.readFloat32Array()
                    let rightVectorData = rightOperand.readFloat32Array()
                    for (let i = 0; i < resultType.count; i++) {
                        result[i] = leftVectorData[i] - rightVectorData[i]
                    }
                    execution.heap[resultId] = new Pointer(new Memory(result.buffer), 0, resultType)
                })
                console.debug(`$${resultId} = OpFSub $${leftOperandId} $${rightOperandId}`)
                state.processed = true
            }
        break
    }
}
