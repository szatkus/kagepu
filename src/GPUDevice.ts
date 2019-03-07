import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'

export default class {
  extensions = extensions
  limit = limits
  adapter: GPUAdapter
  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }
}
