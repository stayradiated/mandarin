import type { Range } from './types.js'

const visualizeRange = (list: Range[], total: number): string => {
  const result = Array.from({ length: total }).fill('.')
  for (const range of list.values()) {
    const [start, end] = range
    for (let i = start; i < end; i++) {
      result[i] = 'X'
    }
  }

  return result.join('')
}

export { visualizeRange }
