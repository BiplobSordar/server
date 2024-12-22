export const UserModel = `CREATE TABLE IF NOT EXISTS USERS (
            id SERIAL PRIMARY KEY,
            userName VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) CHECK (role IN ('instructor', 'student')) DEFAULT 'student',
            photo_url VARCHAR(255) ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   
            );`



export const CourseTable = `CREATE TABLE IF NOT EXISTS COURSES (
 
id BIGINT PRIMARY KEY,
courseTitle VARCHAR(255) NOT NULL,
subTitle VARCHAR(255) ,
category VARCHAR(50) NOT NULL
description VARCHAR(1000) NOT NULL,
coursePrice NUMBER NOT NULL,
courseThumbnail VARCHAR(255)  NOT NULL,
courseLevel VARCHAR(20) CHECK (courseLevel IN ("Beginner", "Medium", "Advance")),
isPublished BOOLEAN DEFAULT false,
authorId INT NOT NULL,
created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (authorId) REFERENCES USERS(id)



)`


// export const LecturesModel=`CREATE TABLE IF NOT EXISTS LECTURES`


export const enrollments = `CREATE TABLE IF NOT EXISTS ENROLLMENTS (
 id BIGINT PRIMARY KEY,
course_id INT NOT NULL,
user_id  Int NOT NULL,
enrolled_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (course_id) REFERENCES COURSES(id),
FOREIGN KEY (user_id) REFERENCES USERS(id),
UNIQUE( course_id,user_id)

)`