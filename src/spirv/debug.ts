import { CompilationState, CompiledModule } from "./compilation";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpSource
        // OpSourceExtension
        case 3:
        case 4:
            console.debug('OpSource')
            state.pos += state.wordCount - 1
        break
        // OpName
        case 5:
            {
                let targetId = state.consumeWord()
                module.names[targetId] = state.consumeString()
                console.debug(`$${targetId} OpName  ` + module.names[targetId].toString())
            }
        break
        // OpMemberName
        case 6:
            {
                let typeId = state.consumeWord()
                let memberNumber = state.consumeWord()
                let name = state.consumeString()
                console.debug(`OpMemberName ${name} ${typeId}`)
            }
        break
        // OpString
        case 7:
            {
                let resultId = state.consumeWord()
                module.heap[resultId] = state.consumeString()
                console.debug(`$${resultId} = OpString ` + module.heap[resultId].toString())
            }
        break
    }
}
