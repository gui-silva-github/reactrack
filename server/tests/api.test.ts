import request from "supertest"
import app from "../app"
import userModel from "../models/user"
import transporter from "../templates/nodemailer"
import { expect, sinon } from "./setup"
import { mockInvalidPayload, mockRegisterPayload } from "./helpers/mockData"

describe("POST /auth/register", () => {
  it("should create a user with a valid payload and return a 201 status code", async () => {
    process.env.JWT_SECRET = "test-secret"
    process.env.SENDER_EMAIL = "noreply@reactrack.test"

    sinon.stub(userModel, "findOne").resolves(null)
    sinon.stub(userModel.prototype, "save").resolves()
    sinon.stub(transporter, "sendMail").resolves({} as never)

    const res = await request(app)
      .post("/auth/register")
      .send(mockRegisterPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(201)
    expect(res.body).to.have.property("success", true)
    expect(res.body).to.have.property("user")
    expect(res.body.user).to.have.property("id")
    expect(res.body.user).to.have.property("name", mockRegisterPayload.name)
    expect(res.body.user).to.have.property("email", mockRegisterPayload.email)
  })

  it("should return 400 for an invalid payload", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send(mockInvalidPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(400)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })

  it("should return 500 when a database error occurs", async () => {
    process.env.JWT_SECRET = "test-secret"
    sinon.stub(userModel, "findOne").rejects(new Error("DB connection failed"))

    const res = await request(app)
      .post("/auth/register")
      .send(mockRegisterPayload)
      .set("Content-Type", "application/json")

    expect(res.status).to.equal(500)
    expect(res.body).to.have.property("success", false)
    expect(res.body).to.have.property("message")
  })
})
