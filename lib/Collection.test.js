import { it, expect, describe } from 'vitest'
import { ActivityStreamObject } from './ActivityStreamObject.js'
import { Collection } from './Collection.js'

describe('Collection', () => {
  it('should extend ActivityStreamObject', () => {
    expect(new Collection()).toBeInstanceOf(ActivityStreamObject)
  })
})
