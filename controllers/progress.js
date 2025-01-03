import postgres from "postgres"


export const getProgress = async (req, res) => {
    const { course_id } = req.params
    const user_id = req.id

    try {

        const sql = postgres(`${process.env.DATABASE_URL}`);

        const courseProgress = await sql`SELECT course_progress.*,
        courses.id as course_id,
                courses.title as course_title,
                    
                            JSON_AGG(
                                    JSON_BUILD_OBJECT(
                                            'id', lectures.id,
                                                    'title', lectures.title,
                                                            'videourl', lectures.videourl,
                                                                   
                                                                           'course_id', lectures.course_id,
                                                                                   
                                                                                           'created_at', lectures.created_at,
                                                                                                   'updated_at', lectures.updated_at
                                                                                                                      )
                                                                                     ) AS related_lectures
                                                                                    FROM course_progress
                                                                                     INNER JOIN courses ON course_progress.course_id = courses.id 
                                                                                    INNER JOIN lectures ON lectures.course_id = course_progress.course_id
                                                    WHERE course_progress.course_id = ${course_id} AND course_progress.user_id = ${user_id}
                                                                          GROUP BY course_progress.id, course_progress.user_id, course_progress.course_id, course_progress.completed, courses.id
     `


       

        return res.status(200).json({
            success: true,
            courseProgress: courseProgress[0]
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false, message: 'Internal Server Error from progresss'
        })
    }
}
export const updateLectureProgress = async (req, res) => {
    const { course_id, lecture_id } = req.params
    const user_id = req.id
    // cono

    console.log(course_id, lecture_id)

    try {
        const sql = postgres(`${process.env.DATABASE_URL}`);
        const lectureProgress = await sql`WITH check_existence AS (
        SELECT 1
        FROM lecture_progress
        WHERE  lecture_id = ${lecture_id} AND course_id=${course_id} AND user_id=${user_id}
      )
      INSERT INTO lecture_progress (lecture_id, viewed,course_id,user_id)
      SELECT ${lecture_id},${true},${course_id},${user_id}
      WHERE NOT EXISTS (SELECT 1 FROM check_existence) RETURNING*;
      `

        

        if (lectureProgress.length == 0) {

            return res.status(404).json({ message: "Course progress not found" });
        }


        return res.status(200).json({
            success: true, message: "Course marked as completed."
        })
    } catch (error) {
        console.log(error, 'this is progress.js errror at updateLectureProgress controller...')
        return res.status(500).json({
            success: false, message: 'Internal Server Error'
        })
    }
}
export const markAsCompleted = async (req, res) => {
  


    try {
        const sql = postgres(`${process.env.DATABASE_URL}`);
        const { course_id } = req.params
        const user_id = req.id
        const courseProgress = await sql`
                             SELECT course_progress.*,
       JSON_AGG(
                  JSON_BUILD_OBJECT(
                                 'id', lectures.id,
                                                'title', lectures.title
                                                           )
                                                                  ) AS related_lectures
                                                                  FROM course_progress
                                                                  INNER JOIN lectures ON lectures.course_id = course_progress.course_id 
                                                                  WHERE course_progress.user_id = ${user_id} AND course_progress.course_id = ${course_id}
                                                                  GROUP BY course_progress.id ;
        `
      

        if (courseProgress.length == 0) {

            return res.status(404).json({ message: "Course progress not found" });
        }



        //   get all the lecture id stored in lecture_progress 
        const lecture_in_lecture_progres = await sql`SELECT lecture_id from lecture_progress WHERE course_id=${course_id} AND user_id=${user_id}`
        const lectureIdsInLectureProgress = lecture_in_lecture_progres.map((item) => (item.lecture_id))

        //   get all the lectures id att with the course
        const lec_att_with_course = courseProgress[0].related_lectures.map((lec) => (lec.id))
        



        const toStore = lec_att_with_course.filter(value => !lectureIdsInLectureProgress.includes(value));

        if (toStore) {
            const lectures = toStore.map((item) => ({
                lecture_id: item,
                course_id: Number(course_id),
                user_id,
                viewed: true
            }))



            await sql`insert into lecture_progress ${sql(lectures)}`
        }




        await sql`UPDATE course_progress SET completed =${true} where course_id=${course_id} AND user_id =${user_id};`

        return res.status(200).json({
            success: true,
            message: "Course marked as completed."
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false, message: 'Internal Server Error'
        })
    }
}
export const markAsIncomplete = async (req, res) => {


    try {

        const sql = postgres(`${process.env.DATABASE_URL}`);
        const { course_id } = req.params
        const user_id = req.id
        const [courseProgress] = await sql`
                             SELECT *
                             FROM course_progress
                                                                  
                                                                  WHERE user_id = ${user_id} AND course_id = ${course_id}
                                                                  
        `

        if (courseProgress.length == 0) {

            return res.status(404).json({ message: "Course progress not found" });
        }

        await sql`DELETE FROM lecture_progress WHERE course_id=${course_id} AND user_id=${user_id}`

        await sql`UPDATE course_progress
        SET  completed = ${false}
        WHERE user_id = ${user_id} AND course_id = ${course_id}
        ; `




        return res.status(200).json({
            success: true,
            message:'Course marked as Incompleted.'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false, message: 'Internal Server Error'
        })
    }
}