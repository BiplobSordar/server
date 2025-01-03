import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getProgress, markAsCompleted, markAsIncomplete, updateLectureProgress } from '../controllers/progress.js';
const router = express.Router()


router.route('/:course_id([0-9]+)').get(isAuthenticated, getProgress)
router.route('/:course_id([0-9]+)/lecture/:lecture_id([0-9]+)/view').post(isAuthenticated, updateLectureProgress)
router.route('/:course_id([0-9]+)/complete').post(isAuthenticated,markAsCompleted)

router.route('/:course_id([0-9]+)/incomplete').post(isAuthenticated,markAsIncomplete)

export default router