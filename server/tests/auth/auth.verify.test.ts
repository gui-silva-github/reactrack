import request from "supertest"
import jwt from "jsonwebtoken"
import app from "../../app"
import userModel from "../../models/user"
import transporter from "../../templates/nodemailer"
import { expect, sinon } from "../setup"

describe("Verify account endpoints", () => {
  const authCookie = ["token=fake-token"]
  const authUserId = "507f1f77bcf86cd799439011"

  describe("POST /auth/send-verify-otp", () => {
    it("should return 400 when authenticated user is not found", async () => {
      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").resolves(null)

      const res = await request(app).post("/auth/send-verify-otp").set("Cookie", authCookie)

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property("success", false)
    })

    it("should return 200 when account is already verified", async () => {
      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").resolves({ isAccountVerified: true } as never)

      const res = await request(app).post("/auth/send-verify-otp").set("Cookie", authCookie)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", false)
    })

    it("should return 200 when OTP email is sent", async () => {
      process.env.SENDER_EMAIL = "noreply@reactrack.test"

      const userDoc = {
        email: "test@example.com",
        isAccountVerified: false,
        verifyOtp: "",
        verifyOtpExpireAt: 0,
        save: sinon.stub().resolves(),
      }

      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").resolves(userDoc as never)
      sinon.stub(transporter, "sendMail").resolves({} as never)

      const res = await request(app).post("/auth/send-verify-otp").set("Cookie", authCookie)

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", true)
    })
  })

  describe("POST /auth/verify-account", () => {
    it("should return 400 when OTP is missing", async () => {
      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)

      const res = await request(app)
        .post("/auth/verify-account")
        .set("Cookie", authCookie)
        .send({ otp: "" })
        .set("Content-Type", "application/json")

      expect(res.status).to.equal(400)
      expect(res.body).to.have.property("success", false)
    })

    it("should return 401 when OTP is invalid", async () => {
      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").resolves({
        verifyOtp: "654321",
        verifyOtpExpireAt: Date.now() + 60_000,
      } as never)

      const res = await request(app)
        .post("/auth/verify-account")
        .set("Cookie", authCookie)
        .send({ otp: "123456" })
        .set("Content-Type", "application/json")

      expect(res.status).to.equal(401)
      expect(res.body).to.have.property("success", false)
    })

    it("should return 200 when account verification succeeds", async () => {
      const userDoc = {
        verifyOtp: "123456",
        verifyOtpExpireAt: Date.now() + 60_000,
        isAccountVerified: false,
        save: sinon.stub().resolves(),
      }

      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").resolves(userDoc as never)

      const res = await request(app)
        .post("/auth/verify-account")
        .set("Cookie", authCookie)
        .send({ otp: "123456" })
        .set("Content-Type", "application/json")

      expect(res.status).to.equal(200)
      expect(res.body).to.have.property("success", true)
    })

    it("should return 500 when database lookup fails", async () => {
      sinon.stub(jwt, "verify").returns({ id: authUserId } as never)
      sinon.stub(userModel, "findById").rejects(new Error("DB error"))

      const res = await request(app)
        .post("/auth/verify-account")
        .set("Cookie", authCookie)
        .send({ otp: "123456" })
        .set("Content-Type", "application/json")

      expect(res.status).to.equal(500)
      expect(res.body).to.have.property("success", false)
    })
  })
})
