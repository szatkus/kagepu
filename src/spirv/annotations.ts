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
            } else {
                dontKnow()
            }
            module.decorations[targetId] = module.decorations[targetId] ? module.decorations[targetId].push(decoration) : [decoration]
            console.debug(`decorate ${targetId} with ${decorationCode}`)
        break
        // OpMemberDecorate
        case 72:
            {
                let typeId = state.consumeWord()
                let memberNumber = state.consumeWord()
                if (state.consumeWord() == 11) {
                    //(members[memberNumber] as any).builtin = code[pos]
                } else {
                    dontKnow()
                }
                console.debug(`OpMemberDecorate ${memberNumber}`)
            }
        break
    }
}
