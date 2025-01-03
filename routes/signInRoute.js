import express from 'express'
import { getUserProfile, login, logout, register, updateRole, updateUser } from '../controllers/signIn.js'
import { signInValidation } from '../middlewares/validation.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utils/multer.js'




const router = express.Router()

router.route('/register').post(signInValidation('signUp'), register)
router.route('/login').post(signInValidation('signIn'), login)
router.route('/profile').get(isAuthenticated, getUserProfile)
router.route('/profile/update').put(isAuthenticated,upload.single('file'), updateUser)
router.route('/logout').get(logout)
router.route('/profile/update_role').put(isAuthenticated,updateRole)




export default router