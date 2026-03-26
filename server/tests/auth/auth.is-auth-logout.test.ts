import request from "supertest"
import jwt from "jsonwebtoken"
import app from "../../app"
import { expect, sinon } from "../setup"

describe("Auth status and logout endpoints", () => {
  describe("GET /auth/is-auth", () => {
    it("should return success true for an authenticated request", async () => {
      sinon.stub(jwt, "verify").returns({ id: "507f1f77bcf86cd799439011" } as never)

      const res = await request(app).get("/auth/is-auth").set("Cookie", ["token=fake-token"])

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", true)
    })

    it("should return success false when token is missing", async () => {
      const res = await request(app).get("/auth/is-auth")

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", false)
      expect(res.body).to.have.property("message")
    })
  })

  describe("POST /auth/logout", () => {
    it("should clear cookie and return success true", async () => {
      const res = await request(app).post("/auth/logout")

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", true)
      expect(res.body).to.have.property("message")
    })
  })
})
