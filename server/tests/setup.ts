import { expect } from "chai"
import * as sinon from "sinon"

export { expect, sinon }

afterEach(() => {
  sinon.restore()
})
