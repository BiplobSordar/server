import postgres from "postgres";

import { validationResult } from "express-validator";
import { distroyFile, uploadFile } from "../utils/cloudinary.js";
import { toBoolean } from "../utils/toBoolean.js";


export const searchCourse = async (req, res) => {
    try {
      const sql = postgres(`${process.env.DATABASE_URL}`);
      const { query = "", categories = [], sortByPrice = "" } = req.query;
     
  
      // Start building the query
      let baseQuery = `
        SELECT 
          courses.*, 
          users.username AS instructor, 
          users.photo_url AS avatar 
        FROM courses 
        LEFT JOIN users ON courses.authorid = users.id 
        WHERE courses.ispublished = TRUE 
      `;
  
      // Add search criteria for query string
      const queryConditions = [];
      const queryParams = [];
  
      if (query) {
        queryConditions.push(`
          (courses.title ILIKE $${queryParams.length + 1} OR 
           courses.subtitle ILIKE $${queryParams.length + 1} OR 
           courses.category ILIKE $${queryParams.length + 1})
        `);
        queryParams.push(`%${query}%`);
      }
  
      // Add category filter
      if (categories.length > 0) {
        const categoryPlaceholders = categories.map((_, index) => `$${queryParams.length + index + 1}`).join(", ");
        queryConditions.push(`courses.category IN (${categoryPlaceholders})`);
        queryParams.push(...categories);
      }
  
      // Combine conditions
      if (queryConditions.length > 0) {
        baseQuery += ` AND ${queryConditions.join(" AND ")}`;
      }
  
      // Add sorting
      if (sortByPrice === "low") {
        baseQuery += " ORDER BY courses.courseprice ASC";
      } else if (sortByPrice === "high") {
        baseQuery += " ORDER BY courses.courseprice DESC";
      }
  
      // Execute the query with parameters
      const courses = await sql.unsafe(baseQuery, queryParams);

      
  
      // Respond with the results
      return res.status(200).json({
        success: true,
        courses: courses || [],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching courses.",
      });
    }
  };
  

export const getCourses = async (req, res) => {

  


    const sql = postgres(`${process.env.DATABASE_URL}`);
    try {
      
        const courses = await sql`SELECT * FROM COURSES WHERE authorId =${req.id} ORDER BY created_at DESC`


        return res.status(200).json({
            success: true,
            courses
        })




    } catch (error) {
        console.log(error,'errro happend at course.js')
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
        
    



        await sql`INSERT INTO COURSES (category,title,authorId)
 
                               VALUES(${category} ,${title},${req.id}) RETURNING *`



        if (createCourse.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Course Created Successfull'
            })
        }
    } catch (error) {
        console.log(error,'errro happend at course.js')
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
        console.log(error,'errro happend at course.js')
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
        console.log(error,'errro happend at course.js')
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
        console.log(error,'errro happend at course.js')
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

}


export const publishedCourses = async (req, res) => {


    const sql = postgres(`${process.env.DATABASE_URL}`);





    try {

      

        const courses = await sql`SELECT
         courses.id as course_id,
         courses.title as course_title,
         courses.level as course_level,
         courses.coursethumbnail as course_thumbnail,
         courses.courseprice as course_price,
         users.username as author ,
         users.photo_url as avatar
         
           FROM courses

        JOIN USERS

        ON courses.authorid = users.id
        
        WHERE courses.isPublished= true ORDER BY courses.created_at DESC`;


       

        return res.status(200).json({ success: true, courses })
    } catch (error) {
        console.log(error,'errro happend at course.js')
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}

export const getMyLearningCourses=async(req,res)=>{

    const sql = postgres(`${process.env.DATABASE_URL}`);

    try {
        
        const myCourses=await sql`SELECT purchase.id,
        purchase.course_id,
        courses.id as course_id,
         courses.title as course_title,
         courses.level as course_level,
         courses.coursethumbnail as course_thumbnail,
         courses.courseprice as course_price,
         courses.category as course_category,
         users.username as author ,
         users.photo_url as avatar
               FROM purchase
               INNER JOIN courses ON courses.id = purchase.course_id
               INNER JOIN users ON  courses.authorid = users.id
               WHERE purchase.user_id = ${req.id};      
        `

        
        return res.status(200).json({ success: true, result:myCourses })
    } catch (error) {
        console.log(error,'errro happend at course.js')
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }

}