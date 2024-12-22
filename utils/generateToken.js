import jwt from "jsonwebtoken"

export const generateToken = (res, user, message) => {

    const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1d' })


    return res.status(200).cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).json({status:200, success: true, message:'Logged In Successfull..', user })
}