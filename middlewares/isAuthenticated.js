import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'User Not Authenticated...',
                status: 401
            })
        }

        const decode = jwt.verify(token, process.env.SECRET)
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid Token ',
                success: false,
                status: 401

            })
        }
        
        req.id = decode.userId
        next()

    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;