import { CompilationState, CompiledModule } from "./compilation";
import dontKnow from "../dontKnow";

export class ArrayStride {
    constructor(public stride: Number) {}
}

class Location {
    constructor(public value: number) {}
}

class Builtin {
    constructor(public value: number) {}
}

class DescriptorSet {
    constructor(public value: number) {}
}

class Binding {
    constructor(public value: number) {}
}

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpDecorate
        case 71:
            let targetId = state.consumeWord()
            let decorationCode = state.consumeWord()
            let decoration
            if (decorationCode == 2) {
                decoration = 2
            } else if (decorationCode == 11) {
                decoration = new Builtin(state.consumeWord())
            } else if (decorationCode == 6) {
                decoration = new ArrayStride(state.consumeWord())
            } else if (decorationCode == 30) {
                decoration = new Location(state.consumeWord())
            } else if (decorationCode == 33) {
                decoration = new Binding(state.consumeWord())
            } else if (decorationCode == 34) {
                decoration = new DescriptorSet(state.consumeWord())
            } else {
                dontKnow()
            }
            module.decorations[targetId] = module.decorations[targetId] ? module.decorations[targetId].push(decoration) : [decoration]
            console.debug(`decorate ${targetId} with ${decorationCode}`)
            state.processed = true
        break
        // OpMemberDecorate
        case 72:
            {
                let typeId = state.consumeWord()
                let memberNumber = state.consumeWord()
                let decoration = state.consumeWord()
                if (decoration == 11) {
                    console.debug(`${memberNumber} Builtin ${state.consumeWord()}`)
                } else if (decoration == 35) {
                    console.debug(`${memberNumber} offset ${state.consumeWord()}`)
                } else if (decoration == 5) {
                    console.debug(`${memberNumber} ColMajor`)
                } else if (decoration == 7) {
                    console.debug(`${memberNumber} MatrixStride ${state.consumeWord()}`)
                } else {
                    dontKnow()
                }
                if (state.pos != state.endPos) {
                    dontKnow()
                }
                //console.debug(`OpMemberDecorate ${memberNumber}`)
                state.processed = true
            }
        break
    }
}
