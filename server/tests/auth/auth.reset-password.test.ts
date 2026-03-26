import request from "supertest"
import bcrypt from "bcryptjs"
import app from "../../app"
import userModel from "../../models/user"
import { expect, sinon } from "../setup"

describe("POST /auth/reset-password", () => {
  it("should return 400 when required payload fields are missing", async () => {
    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "", otp: "", newPassword: "" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 400 when user is not found", async () => {
    sinon.stub(userModel, "findOne").resolves(null)

    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword@123" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 401 when OTP is invalid", async () => {
    const userDoc = {
      resetOtp: "654321",
      resetOtpExpireAt: Date.now() + 60_000,
      save: sinon.stub().resolves(),
    }

    sinon.stub(userModel, "findOne").resolves(userDoc as never)

    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword@123" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(401)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 401 when OTP is expired", async () => {
    const userDoc = {
      resetOtp: "123456",
      resetOtpExpireAt: Date.now() - 60_000,
      save: sinon.stub().resolves(),
    }

    sinon.stub(userModel, "findOne").resolves(userDoc as never)

    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword@123" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(401)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 200 when password reset succeeds", async () => {
    const userDoc = {
      resetOtp: "123456",
      resetOtpExpireAt: Date.now() + 60_000,
      password: "old-hash",
      save: sinon.stub().resolves(),
    }

    sinon.stub(userModel, "findOne").resolves(userDoc as never)
    sinon.stub(bcrypt, "hash").resolves("new-hash" as never)

    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword@123" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property("success", true)
  })

  it("should return 500 when database query fails", async () => {
    sinon.stub(userModel, "findOne").rejects(new Error("DB error"))

    const res = await request(app)
      .post("/auth/reset-password")
      .send({ email: "test@example.com", otp: "123456", newPassword: "NewPassword@123" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
  })
})
