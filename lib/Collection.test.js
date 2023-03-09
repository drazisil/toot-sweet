import { ok } from "node:assert/strict";
import { it, describe } from 'node:test'
import { ActivityStreamObject } from './ActivityStreamObject.js'
import { Collection } from './Collection.js'

describe('Collection', () => {
  it('should extend ActivityStreamObject', () => {

    ok(new Collection() instanceof ActivityStreamObject)
  })
})
