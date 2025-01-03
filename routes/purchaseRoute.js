import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { createCheckoutSession, getCourseByIdWithStatus ,stripeWebhook,getAllPurchasedCourse } from '../controllers/purchase.js'


const router = express.Router()


router.route(`/courses/:course_id/show_details`).get(isAuthenticated,getCourseByIdWithStatus);
router.route('/checkout/create-checkout-session').post(isAuthenticated,createCheckoutSession)
router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook);
router.route("/").get(isAuthenticated,getAllPurchasedCourse);



export default router