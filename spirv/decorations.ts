export interface Decoration {

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
