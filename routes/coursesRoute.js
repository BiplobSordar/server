import expres from 'express'

import { createCourse, editCourse, getCourseById, getCourses, getMyLearningCourses, publishedCourse, publishedCourses, searchCourse } from '../controllers/courses.js'
import { courseValidation } from '../middlewares/validation.js'
import upload from '../utils/multer.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'


const router = expres.Router()


// router.route('/publish').get(publishedCourses)
// router.route('/').get(getCourses)
// router.route('/').post(courseValidation(), createCourse)
// router.route('/:courseId').get(getCourseById)
// router.route('/:courseId').put( upload.single('file'), courseValidation(), editCourse)
// router.route('/:courseId').patch( publishedCourse)
router.route('/publish').get(publishedCourses);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/my-learning").get(isAuthenticated, getMyLearningCourses);
router
  .route('/')
  .get(getCourses)
  .post(courseValidation(), createCourse);

router
  .route('/:courseId([0-9]+)')
  .get(getCourseById)
  .put(upload.single('file'), courseValidation(), editCourse)
  .patch(publishedCourse);

 

export default router;

