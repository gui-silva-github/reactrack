import express from "express"
import { downvoteOpinionController, getAllOpinions, postOpinion, upvoteOpinionController } from "../controllers/opinions.js"

const router = express.Router()

router.get('/opinions', getAllOpinions)

router.post('/opinions', postOpinion)

router.post('/opinions/:id/upvote', upvoteOpinionController)

router.post('/opinions/:id/downvote', downvoteOpinionController)

export default router