import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import { Type } from "./types";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpCompositeConstruct
        case 80:
            {
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                
                let constituents = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.get(typeId)
                    execution.put(resultId, execution.getGlobalMemory().createVariable(type, resultId))
                    let i = 0
                    constituents.forEach(c => {
                        execution.get(resultId).setIndex(i, execution.get(c).read())
                        i++
                    })
                })
                console.debug(`$${resultId} = OpCompositeConstruct $${typeId} ${constituents}`)
                state.processed = true
            }
        break
        // OpCompositeExtract
        case 81:
            {
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                let compositeId = state.consumeWord()
                let indexes = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.get(typeId)
                    let composite = execution.get(compositeId)
                    indexes.forEach(i => {
                        composite = composite.getIndex(i)
                    })
                    execution.put(resultId, composite)

                })
                console.debug(`$${resultId} = OpCompositeExtract ${typeId} $${compositeId} ${indexes}`)
                state.processed = true
            }
        break
    }
}
