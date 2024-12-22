import postgres from "postgres";

import { validationResult } from "express-validator";
import { distroyFile, uploadFile } from "../utils/cloudinary.js";
import { toBoolean } from "../utils/toBoolean.js";

export const getCourses = async (req, res) => {


    const sql = postgres(`${process.env.DATABASE_URL}`);
    try {
        const courses = await sql`SELECT * FROM COURSES WHERE authorId =${req.id} ORDER BY created_at DESC`



        return res.status(200).json({
            success: true,
            courses
        })




    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}

export const createCourse = async (req, res) => {
    const sql = postgres(`${process.env.DATABASE_URL}`);
    const { title, category } = req.body

   

    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
        
        return res.status(403).json({
            success: false,
            message: 'Validation Error',
            errors: validationError.mapped()
        })
    }


    try {
        await sql`CREATE TABLE IF NOT EXISTS COURSES (
 
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subTitle VARCHAR(255) ,
        category VARCHAR(50) NOT NULL,
        description VARCHAR(1000) ,
        coursePrice  NUMERIC ,
        level course_level  DEFAULT 'beginner',
        courseThumbnail VARCHAR(255) ,
        isPublished BOOLEAN DEFAULT false,
        authorId INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (authorId) REFERENCES USERS(id)

)`

        // courseLevel VARCHAR(20) CHECK (courseLevel IN ("Beginner", "Medium", "Advance")),



        const createdCourse = await sql`INSERT INTO COURSES (category,title,authorId)
 
                               VALUES(${category} ,${title},${req.id}) RETURNING *`



        if (createCourse.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Course Created Successfull'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Course Creation Failed..'
        })

    }
}


export const getCourseById = async (req, res) => {
    const { courseId } = req.params;
    

    try {
        const sql = postgres(`${process.env.DATABASE_URL}`);

        const course = await sql`SELECT * FROM COURSES WHERE id =${courseId}  AND authorId =${req.id}`

        if (course.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'Course not found...'
            })

        }
       

        return res.status(200).json({
            success: true,
            course: course[0]
        })




    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })

    }




}
export const editCourse = async (req, res) => {
    const sql = postgres(`${process.env.DATABASE_URL}`);

    const { title: courseTitel,
        subTitle: courseSubtitle,
        category: courseCategory,
        level: courseLevel,
        price,
        description: courseDesc
    } = req.body
    const file = req.file
    const { courseId } = req.params
    


    const validationError = validationResult(req)
    if (!validationError.isEmpty()) {
       
        return res.status(403).json({
            success: false,
            message: 'Validation Error',
            errors: validationError.mapped()
        })
    }

    try {

        let thumbnailUrl = null
        const findCourse = await sql`SELECT * FROM COURSES WHERE ID = ${courseId} AND authorId=${req.id}`


        if (findCourse.length == 0) {
            return res.status(404).json({ success: false, message: 'Course Not Found....' })
        }



        //   distroy the existing file 
        if (file) {
            const { coursethumbnail } = findCourse[0]
            if (coursethumbnail) {
                const publicId = coursethumbnail.split("/").pop().split(".")[0];
                await distroyFile(publicId)
            }

            // upload current File 
            const cloudResponse = await uploadFile(file.path)
            thumbnailUrl = cloudResponse.secure_url

        }





       await sql`UPDATE COURSES SET
         
         title =COALESCE(${courseTitel},title),
         subTitle =COALESCE(${courseSubtitle},subTitle),
         category=COALESCE(${courseCategory},category),
         level=COALESCE(${courseLevel.toLowerCase()},level),
         courseprice=COALESCE(${Number(price)},courseprice),
         description=COALESCE(${courseDesc}),
         coursethumbnail=COALESCE(${thumbnailUrl},coursethumbnail)
         
         WHERE id=${courseId} AND authorId=${req.id};
         
         `
      

        return res.status(200).json({ success: true, message: 'Course Updated Successfull' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, Message: 'Internal Server Error' })
    }


}


export const publishedCourse = async (req, res) => {
    const { courseId } = req.params
    const { publish } = req.query
   
    const sql = postgres(`${process.env.DATABASE_URL}`);

 

    const publishStatus = toBoolean(publish)

    try {
        const course = await sql`SELECT * FROM COURSES WHERE id =${courseId} AND authorId =${req.id}`

        if (course.length == 0) {
            return res.status(404).json({ success: false, message: 'Connot Publish The Course' })
        }

        await sql`UPDATE COURSES SET isPublished = ${publishStatus} WHERE id = ${courseId} AND authorId =${req.id} `


        return res.status(200).json({ success: true, message: 'Course Published..' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

}