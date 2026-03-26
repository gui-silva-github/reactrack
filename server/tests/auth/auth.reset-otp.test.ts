import request from "supertest"
import app from "../../app"
import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { expect, sinon } from "../setup"

describe("POST /auth/send-reset-otp", () => {
  it("should return 400 when email is missing", async () => {
    const res = await request(app)
      .post("/auth/send-reset-otp")
      .send({ email: "" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 404 when user is not found", async () => {
    sinon.stub(userModel, "findOne").resolves(null)

    const res = await request(app)
      .post("/auth/send-reset-otp")
      .send({ email: "unknown@example.com" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(404)
    expect(res.body).to.have.property("success", false)
  })

  it("should return 200 when reset OTP is sent", async () => {
    process.env.SENDER_EMAIL = "noreply@reactrack.test"

    const userDoc = {
      email: "test@example.com",
      resetOtp: "",
      resetOtpExpireAt: 0,
      save: sinon.stub().resolves(),
    }

    sinon.stub(userModel, "findOne").resolves(userDoc as never)
    sinon.stub(transporter, "sendMail").resolves({} as never)

    const res = await request(app)
      .post("/auth/send-reset-otp")
      .send({ email: "test@example.com" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property("success", true)
    expect(res.body).to.have.property("message")
  })

  it("should return 500 when database lookup fails", async () => {
    sinon.stub(userModel, "findOne").rejects(new Error("DB error"))

    const res = await request(app)
      .post("/auth/send-reset-otp")
      .send({ email: "test@example.com" })
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
  })
})
