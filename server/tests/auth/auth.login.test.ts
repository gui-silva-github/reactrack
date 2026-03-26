import request from "supertest"
import bcrypt from "bcryptjs"
import app from "../../app"
import userModel from "../../models/user"
import { expect, sinon } from "../setup"
import { mockLoginPayload } from "../helpers/mockData"

describe("POST /auth/login", () => {
  it("should return 200 and user id for valid credentials", async () => {
    process.env.JWT_SECRET = "test-secret"

    const fakeUser = {
      _id: "507f1f77bcf86cd799439011",
      id: "507f1f77bcf86cd799439011",
      email: mockLoginPayload.email,
      password: "hashed-password",
    }

    sinon.stub(userModel, "findOne").resolves(fakeUser as never)
    sinon.stub(bcrypt, "compare").resolves(true as never)

    const res = await request(app)
      .post("/auth/login")
      .send(mockLoginPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.include({
      success: true,
      id: fakeUser.id,
    })
  })

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "", password: "" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 400 when password is invalid", async () => {
    const fakeUser = {
      _id: "507f1f77bcf86cd799439011",
      id: "507f1f77bcf86cd799439011",
      email: mockLoginPayload.email,
      password: "hashed-password",
    }

    sinon.stub(userModel, "findOne").resolves(fakeUser as never)
    sinon.stub(bcrypt, "compare").resolves(false as never)

    const res = await request(app)
      .post("/auth/login")
      .send(mockLoginPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 500 when database lookup fails", async () => {
    sinon.stub(userModel, "findOne").rejects(new Error("DB connection failed"))

    const res = await request(app)
      .post("/auth/login")
      .send(mockLoginPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })
})
