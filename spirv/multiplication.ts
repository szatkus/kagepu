import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import dontKnow from './dontKnow'
import { TypeMatrix, TypeFloat, TypeVector } from './types'
import { Pointer, Memory } from './memory'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpFMul
    case 133:
      {
        let resultTypeId = state.consumeWord()
        let resultId = state.consumeWord()
        let leftOperandId = state.consumeWord()
        let rightOperandId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let resultType = execution.get(resultTypeId)
          let leftOperand = execution.get(leftOperandId) as Pointer
          let rightOperand = execution.get(rightOperandId) as Pointer
          let count = resultType instanceof TypeVector ? resultType.count : 1
          let result = new Float32Array(count)
          let leftVectorData = leftOperand.readFloat32Array()
          let rightVectorData = rightOperand.readFloat32Array()
          for (let i = 0; i < resultType.count; i++) {
            result[i] = leftVectorData[i] * rightVectorData[i]
          }
          execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
        })
        console.debug(`$${resultId} = OpFMul $${leftOperandId} $${rightOperandId}`)
        state.processed = true
      }
      break
        // OpVectorTimesScalar
    case 142:
      {
        let resultTypeId = state.consumeWord()
        let resultId = state.consumeWord()
        let vectorId = state.consumeWord()
        let scalarId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let resultType = execution.get(resultTypeId) as TypeVector
          if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
            dontKnow()
          }
          let vector = execution.get(vectorId) as Pointer
          let scalar = execution.get(scalarId) as Pointer
          let result = new Float32Array(resultType.count)
          let vectorData = vector.readFloat32Array()
          for (let i = 0; i < resultType.count; i++) {
            result[i] = vectorData[i] * scalar.readFloat32()
          }
          execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
        })
        console.debug(`$${resultId} = OpMatrixTimesVector $${vectorId} $${scalarId}`)
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
          let resultType = execution.get(resultTypeId) as TypeVector
          if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
            dontKnow()
          }
          let matrix = execution.get(matrixId) as Pointer
          let vector = execution.get(vectorId) as Pointer
          let result = new Float32Array(resultType.count)
          let matrixType = matrix.type as TypeMatrix
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
          execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
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
          let resultType = execution.get(resultTypeId) as TypeMatrix
          if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
            dontKnow()
          }
          let leftMatrix = execution.get(leftMatrixId) as Pointer
          let rightMatrix = execution.get(rightMatrixId) as Pointer
          let result = new Float32Array(resultType.columns * resultType.rows)
          let leftMatrixType = leftMatrix.type as TypeMatrix
          let rightMatrixType = rightMatrix.type as TypeMatrix
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
          execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
        })
        console.debug(`$${resultId} = OpMatrixTimesMatrix $${leftMatrixId} $${rightMatrixId}`)
        state.processed = true
      }
      break
  }
}
