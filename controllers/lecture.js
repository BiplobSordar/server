import { check, validationResult } from "express-validator";
import postgres from "postgres"

export const createLecture=async(req,res)=>{
    const sql = postgres(`${process.env.DATABASE_URL}`);
    const {title}=req.body
    const {course_id}=req.params
    
    check('title').exists().withMessage('Please Enter The Title').bail().notEmpty().withMessage('Please Enter The Title')

    const error=validationResult(req)
    if (!error.isEmpty()) {
        
        return res.status(403).json({
            success: false,
            message: 'Validation Error',
            errors: validationError.mapped()
        })
    }


    if(!title || !course_id){
       
        return res.status(400).json({
            message:"Required Information is Missing"
        })
    };






    

    try {
            await sql`CREATE TABLE  IF NOT EXISTS LECTURES (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                videoUrl VARCHAR(255) ,
                publicId VARCHAR(255),
                course_id INT NOT NULL,
                isPreviewFree BOOLEAN,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                Foreign Key (course_id ) REFERENCES COURSES(id)
            )`  
               
            
            const createdLecture=await sql`INSERT INTO LECTURES (title,course_id) VALUES (${title},${course_id}) RETURNING *`
           


        return res.status(200).json({success:true,message:'Lecture Created Successfully...'})
    } catch (error) {
        console.log(error,'errro happend at lecture.js')
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }

}
export const getLectures=async(req,res)=>{
    const sql = postgres(`${process.env.DATABASE_URL}`);
    const {course_id}=req.params
    try {

        if(!course_id){
          
            return res.status(400).json({
                message:"Required Information is Missing"
            })
        };


        const lectures=await sql`SELECT * FROM LECTURES WHERE course_id =${course_id}`
      

    
        return res.status(200).json({success:true,lectures})
    } catch (error) {
        console.log(error,'errro happend at lecture.js')
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
export const editLecture=async(req,res)=>{
    const sql = postgres(`${process.env.DATABASE_URL}`);

    const {course_id,lecture_id}=req.params
    const {lectureTitle,isFree,uploadVideoUrl,uploadVideoPublicId}=req.body
    
    

    if(!course_id||!lecture_id){
          
        return res.status(400).json({
            message:"Required Information is Missing"
        })
    };
    try {
        const result=await sql`UPDATE LECTURES SET 
        title =${lectureTitle},
        videoUrl =${uploadVideoUrl || null},
        publicId =${uploadVideoPublicId || null},
        isPreviewFree =${isFree||null},
        updated_at =CURRENT_TIMESTAMP



        WHERE id =${lecture_id} AND course_id =${course_id} RETURNING *;
        `
   

        return res.status(200).json({success:true,message:'Lecture Updated Successfully..'})
    } catch (error) {
        console.log(error,'errro happend at lecture.js')
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
export const removeLecture=async(req,res)=>{
    const sql = postgres(`${process.env.DATABASE_URL}`);
    const {course_id,lecture_id}=req.params

    
    try {
        await sql`DELETE FROM LECTURES WHERE id=${lecture_id} AND course_id =${course_id}`
        return res.status(200).json({success:true,message:'Lecture Deleted Successfull...'})
    } catch (error) {
        console.log(error,'errro happend at lecture.js')
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}

export const getLectureById=async(req,res)=>{
    const sql = postgres(`${process.env.DATABASE_URL}`);
    const {course_id,lecture_id}=req.params
    console.log(course_id.lecture_id)

    if(!course_id|| !lecture_id){
          
        return res.status(400).json({
            message:"Required Information is Missing"
        })
    };
    try {
        const lecture=await sql`SELECT * FROM LECTURES WHERE id =${lecture_id} AND course_id =${course_id}`
        

        return res.status(200).json({success:true,lecture:lecture[0]})
    } catch (error) {
        console.log(error,'errro happend at lecture.js')
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}
