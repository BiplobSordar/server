import expres from 'express'

import { createCourse, editCourse, getCourseById, getCourses, publishedCourse } from '../controllers/courses.js'
import { courseValidation } from '../middlewares/validation.js'
import upload from '../utils/multer.js'


const router = expres.Router()


router.route('/').get(getCourses)
router.route('/').post(courseValidation(), createCourse)
router.route('/:courseId').get(getCourseById)
router.route('/:courseId').put(upload.single('file'),courseValidation(), editCourse)
router.route('/:courseId').patch(publishedCourse)
export default router;