import { CompilationState, CompiledModule } from './compilation'
import dontKnow from '../dontKnow'

interface Decoration {

}

export class ArrayStride implements Decoration {
  constructor (public stride: Number) {}
}

export class Location implements Decoration {
  constructor (public value: number) {}
}

export class Builtin implements Decoration {
  constructor (public value: number) {}
}

export class DescriptorSet implements Decoration {
  constructor (public value: number) {}
}

export class Binding implements Decoration {
  constructor (public value: number) {}
}

export class RelaxedPrecision implements Decoration {

}

export class Decorations {
  decorations: Array<Array<Decoration>> = []

  putDecoration (index: number, decoration: Decoration) {
    if (!this.decorations[index]) {
      this.decorations[index] = []
    }
    this.decorations[index].push(decoration)
  }

  getSingleDecoration<T extends Decoration> (index: number, clazz: Function): T {
    return this.decorations[index].filter(e => e instanceof clazz)[0] as T
  }
}

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpDecorate
    case 71:
      let targetId = state.consumeWord()
      let decorationCode = state.consumeWord()
      let decoration
      if (decorationCode === 2) {
        decoration = 2
      } else if (decorationCode === 0) {
        decoration = new RelaxedPrecision()
        console.debug(`Decorate $${targetId} with RelaxedPrecision()`)
      } else if (decorationCode === 11) {
        decoration = new Builtin(state.consumeWord())
        console.debug(`Decorate $${targetId} with Builtin(${decoration.value})`)
      } else if (decorationCode === 6) {
        decoration = new ArrayStride(state.consumeWord())
        console.debug(`Decorate $${targetId} with ArrayStride(${decoration.stride})`)
      } else if (decorationCode === 30) {
        decoration = new Location(state.consumeWord())
        console.debug(`Decorate $${targetId} with Location(${decoration.value})`)
      } else if (decorationCode === 33) {
        decoration = new Binding(state.consumeWord())
        console.debug(`Decorate $${targetId} with Binding(${decoration.value})`)
      } else if (decorationCode === 34) {
        decoration = new DescriptorSet(state.consumeWord())
        console.debug(`Decorate $${targetId} with DescriptorSet(${decoration.value})`)
      } else {
        dontKnow()
      }
      module.decorations.putDecoration(targetId, decoration as Decoration)
      state.processed = true
      break
        // OpMemberDecorate
    case 72:
      {
        let typeId = state.consumeWord()
        let memberNumber = state.consumeWord()
        let decoration = state.consumeWord()
        if (decoration === 11) {
          console.debug(`${memberNumber} Builtin ${state.consumeWord()}`)
        } else if (decoration === 35) {
          console.debug(`${memberNumber} offset ${state.consumeWord()}`)
        } else if (decoration === 5) {
          console.debug(`${memberNumber} ColMajor`)
        } else if (decoration === 7) {
          console.debug(`${memberNumber} MatrixStride ${state.consumeWord()}`)
        } else {
          dontKnow()
        }
        if (state.pos !== state.endPos) {
          dontKnow()
        }
                // console.debug(`OpMemberDecorate ${memberNumber}`)
        state.processed = true
      }
      break
  }
}
