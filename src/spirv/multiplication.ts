import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";
import { TypeMatrix, TypeFloat, TypeVector } from "./types";
import { Pointer, Memory } from "./memory";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFMul
        case 133:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperand = state.consumeWord()
                let rightOperand = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFMul $${leftOperand} $${rightOperand}`)
                state.processed = true
            }
        break
        // OpVectorTimesScalar
        case 142:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let vector = state.consumeWord()
                let scalar = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpMatrixTimesVector $${vector} $${scalar}`)
                state.processed = true
            }
        break
        // OpMatrixTimesVector
        case 145:
            {
                let resultTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let matrixId = state.consumeWord()
                let vectorId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let resultType = <TypeVector> execution.heap[resultTypeId]
                    if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
                        dontKnow()
                    }
                    let matrix = <Pointer> execution.heap[matrixId]
                    let vector = <Pointer> execution.heap[vectorId]
                    let result = new Float32Array(resultType.count)
                    let matrixType = <TypeMatrix> matrix.type
                    let matrixData = matrix.readFloat32Array()
                    let vectorData = vector.readFloat32Array()
                    for (let i = 0; i < resultType.count; i++) {
                        let accumulator = 0
                        for (let c = 0; c < matrixType.columns; c++) {
                            let leftValue = matrixData[c * matrixType.rows + i]
                            let rightValue = vectorData[i]
                            accumulator += leftValue * rightValue
                        }
                        result[i] = accumulator
                    }
                    execution.heap[resultId] = new Pointer(new Memory(result.buffer), 0, resultType)
                })
                console.debug(`$${resultId} = OpMatrixTimesVector $${matrixId} $${vectorId}`)
                state.processed = true
            }
        break
        // OpMatrixTimesMatrix
        case 146:
            {
                let resultTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let leftMatrixId = state.consumeWord()
                let rightMatrixId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let resultType = <TypeMatrix> execution.heap[resultTypeId]
                    if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
                        dontKnow()
                    }
                    let leftMatrix = <Pointer> execution.heap[leftMatrixId]
                    let rightMatrix = <Pointer> execution.heap[rightMatrixId]
                    let result = new Float32Array(resultType.columns * resultType.rows)
                    let leftMatrixType = <TypeMatrix> leftMatrix.type
                    let rightMatrixType = <TypeMatrix> rightMatrix.type
                    let leftMatrixData = leftMatrix.readFloat32Array()
                    let rigtMatrixData = rightMatrix.readFloat32Array()
                    for (let c = 0; c < resultType.columns; c++) {
                        for (let r = 0; r < resultType.rows; r++) {
                            let accumulator = 0
                            for (let i = 0; i < leftMatrixType.columns; i++) {
                                let leftValue = leftMatrixData[c * leftMatrixType.rows + i]
                                let rightValue = rigtMatrixData[r + i * rightMatrixType.rows]
                                accumulator += leftValue * rightValue
                            }
                            result[r + c * resultType.rows] = accumulator
                        }
                    }
                    execution.heap[resultId] = new Pointer(new Memory(result.buffer), 0, resultType)
                })
                console.debug(`$${resultId} = OpMatrixTimesMatrix $${leftMatrixId} $${rightMatrixId}`)
                state.processed = true
            }
        break
    }
}
