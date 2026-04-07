import request from "supertest"
import jwt from "jsonwebtoken"
import app from "../../app"
import userModel from "../../models/user"
import { expect, sinon } from "../setup"

describe("GET /user/data", () => {
  const authCookie = ["token=fake-token"]
  const authUserId = "507f1f77bcf86cd799439011"

  it("should return 200 with user data for an authenticated user", async () => {
    sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
    sinon.stub(userModel, "findById").resolves({
      _id: authUserId,
      name: "Test User",
      email: "test@example.com",
      isAccountVerified: true,
    } as never)

    const res = await request(app).get("/user/data").set("Cookie", authCookie)

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property("success", true)
    expect(res.body).to.have.property("userData")
    expect(res.body.userData).to.deep.equal({
      id: authUserId,
      name: "Test User",
      email: "test@example.com",
      isAccountVerified: true,
    })
  })

  it("should return 400 when user is not found", async () => {
    sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
    sinon.stub(userModel, "findById").resolves(null)

    const res = await request(app).get("/user/data").set("Cookie", authCookie)

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 500 when data retrieval fails", async () => {
    sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
    sinon.stub(userModel, "findById").rejects(new Error("DB error"))

    const res = await request(app).get("/user/data").set("Cookie", authCookie)

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
  })
})
