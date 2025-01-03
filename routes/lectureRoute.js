import express from 'express'
import { createLecture, editLecture, getLectureById, getLectures, removeLecture } from '../controllers/lecture.js'


const router = express.Router()
// router.route('/lecture').post(createLecture)

router.route('/:course_id([0-9]+)/lecture').post(createLecture)
router.route('/:course_id([0-9]+)/lecture').get(getLectures)
router.route('/:course_id([0-9]+)/lecture/:lecture_id([0-9]+)').get(getLectureById)
router.route('/:course_id([0-9]+)/lecture/:lecture_id([0-9]+)').put(editLecture)
router.route('/:course_id([0-9]+)/lecture/:lecture_id([0-9]+)').delete(removeLecture)


export default router;