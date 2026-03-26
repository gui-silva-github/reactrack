import request from "supertest"
import app from "../../app"
import userModel from "../../models/user"
import { expect, sinon } from "../setup"
import { mockResetOtpPayload } from "../helpers/mockData"

describe("POST /auth/validate-reset-otp", () => {
  it("should return 400 when email or OTP is missing", async () => {
    const res = await request(app)
      .post("/auth/validate-reset-otp")
      .send({ email: "", otp: "" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 404 when user does not exist", async () => {
    sinon.stub(userModel, "findOne").resolves(null)

    const res = await request(app)
      .post("/auth/validate-reset-otp")
      .send(mockResetOtpPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(404)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 401 when OTP is expired", async () => {
    const expiredUser = {
      resetOtp: mockResetOtpPayload.otp,
      resetOtpExpireAt: Date.now() - 60_000,
    }

    sinon.stub(userModel, "findOne").resolves(expiredUser as never)

    const res = await request(app)
      .post("/auth/validate-reset-otp")
      .send(mockResetOtpPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(401)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 200 when OTP is valid", async () => {
    const validUser = {
      resetOtp: mockResetOtpPayload.otp,
      resetOtpExpireAt: Date.now() + 60_000,
    }

    sinon.stub(userModel, "findOne").resolves(validUser as never)

    const res = await request(app)
      .post("/auth/validate-reset-otp")
      .send(mockResetOtpPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property("success", true)
    expect(res.body).to.have.property("message")
  })

  it("should return 500 when database query fails", async () => {
    sinon.stub(userModel, "findOne").rejects(new Error("DB error"))

    const res = await request(app)
      .post("/auth/validate-reset-otp")
      .send(mockResetOtpPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })
})
