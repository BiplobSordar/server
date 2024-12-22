import { validationResult } from "express-validator"


import bcrypt from "bcryptjs";
// import {sql} from "../db/sql.js";
import postgres from 'postgres'
import { generateToken } from "../utils/generateToken.js";
import { distroyFile, uploadFile } from "../utils/cloudinary.js";




export const register = async (req, res) => {
    // Database Connection 
    const sql = postgres(`${process.env.DATABASE_URL}`);



    const { userName, email, password } = req.body

    if (!userName || !email || !password) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'All Field Must Required'
        })
    }


    // validation check 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(403)
            .json({ status: 403, success: false, errors: errors.mapped() });
    }



    // Create User Table If Not Exists

    const createUserTable = async () => {


        const result = await sql`CREATE TABLE IF NOT EXISTS USERS (
            id SERIAL PRIMARY KEY,
            userName VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) CHECK (role IN ('instructor', 'student')) DEFAULT 'student',
            photo_url VARCHAR(255) ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   
            );`

    }


    // Inser Data Query for Inserting User Data To The User Table 


    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await createUserTable()



        const createdUser = await sql`INSERT INTO users (userName,email,password,role) VALUES(${userName},${email},${hashedPassword},'student') RETURNING *;`


        if (createdUser.length > 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'User Created Successfull !!'
            })

        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: 'Failed to Ragester...' })
    }



}

export const login = async (req, res) => {

    // Database Connection 
    const sql = postgres(`${process.env.DATABASE_URL}`);

    const { email, password } = req.body


    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'All Field Must Required'
        })
    }


    const errors = validationResult(req)



    if (!errors.isEmpty()) {
        return res.status(403).json({
            status: 403,
            success: false,
            errors: errors.mapped()
        })
    }


    try {
        // check the email for user exists,,,,

        const user = await sql`SELECT * FROM users WHERE email = ${email}`


        if (user.length == 0) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid Createntials..'
            })
        }

        let [userC] = user

        // Check The password
        const isPasswordMatched = await bcrypt.compare(password, userC.password)


        if (!isPasswordMatched) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'Invalid Createntials..'
            })
        }


        generateToken(res, userC, `Welcome ${user.userName}`)



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed To Login..'
        })

    }

}


export const logout = async (_, res) => {


    try {

        return res.status(200).cookie('token', "", { maxAge: 0 }).json({
            success: true,
            message: 'User LoggedOut Successfull..',
            status: 200
        })

    } catch (error) {

        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed To Logout..'
        })
    }
}

export const getUserProfile = async (req, res) => {

    const sql = postgres(`${process.env.DATABASE_URL}`);



    try {

        const user = await sql`SELECT * FROM USERS WHERE id = ${req.id}`

        if (user.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'User Not Found...',
                status: 404
            })
        }

        return res.status(200).json({
            success: true,
            user: user[0]
        })


    } catch (error) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: 'Failed To Get User Details ...'
        })
    }


}
export const updateUser = async (req, res) => {
    const sql = postgres(`${process.env.DATABASE_URL}`);

    const { name } = req.body
    const file = req.file
    const id = req.id
   


   try {
    const user = await sql`SELECT * FROM USERS WHERE id =${id}`
    if (user.length == 0) {
        return res.status(404).json({ message: 'User not found', success: false })
    }
    if (file == undefined && name) {


        await sql`UPDATE USERS SET userName =${name}  WHERE id =${id}`




        return res.json({
            status: 200, success: true,

        })
    }

    if (file && !name) {
        if (user.photo_url) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            distroyFile(publicId)
        }
        const cloudResponse = await uploadFile(file.path)

        const photoUrl = cloudResponse.secure_url

        await sql`UPDATE USERS SET photo_url = ${photoUrl}  WHERE id =${id} RETURNING *`
        return res.json({
            status: 200, success: true,

        })

    }




    if (file && name) {
        if (user.photo_url) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            distroyFile(publicId)
        }
        const cloudResponse = await uploadFile(file.path)

        const photoUrl = cloudResponse.secure_url

        await sql`UPDATE USERS SET photo_url = ${photoUrl}, userName =${name}  WHERE id =${id} RETURNING *`




        return res.json({
            status: 200, success: true,

        })

    }

   } catch (error) {
    return res.status(500).json({
        status: 500,
        success: false,
        message: 'Failed To Update User Details ...'
    })
   }





}