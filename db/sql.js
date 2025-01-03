import postgres from 'postgres'
import dotenv from 'dotenv'


dotenv.config()
const URL = process.env.DATABASE_URL

const sql = postgres(URL);


// export const initializeDB = async () => {

//     try {
//         // Begin transaction 
//         await sql.begin(async (sql) => {
//             // create custom type 
//             await sql`
//             DO $$ BEGIN 
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='user_role') THEN
//             CREATE TYPE user_role AS ENUM ('student', 'instructor');
//             END IF;
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname ='course_level') THEN
//             CREATE TYPE course_level AS ENUM ('beginner', 'medium', 'advance');
//             END IF;
//             IF NOT EXISTS (SELECT 1 from pg_type WHERE typname ='course_status') THEN
//             CREATE TYPE course_status AS ENUM ('complete', 'pending', 'failed');
//             END IF;
//             END $$
//             `;

//             // create table 
//             await sql`CREATE TABLE IF NOT EXISTS Users (
//                       id SERIAL PRIMARY KEY,
//                       username VARCHAR(50) NOT NULL,
//                       email VARCHAR(100) UNIQUE NOT NULL,
//                       password VARCHAR(255) NOT NULL,
//                       role user_role DEFAULT 'student',
//                       photo_url VARCHAR(255),
//                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//                     );
//            CREATE TABLE IF NOT EXISTS Courses (
//                      id SERIAL PRIMARY KEY,
//                      title VARCHAR(255) NOT NULL,
//                      subtitle VARCHAR(255),
//                      category VARCHAR(50) NOT NULL,
//                      description VARCHAR(1000),
//                      courseprice NUMERIC,
//                      level course_level DEFAULT 'beginner',
//                      coursethumbnail VARCHAR(255),
//                      ispublished BOOLEAN DEFAULT false,
//                      authorid INTEGER NOT NULL,
//                      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                      CONSTRAINT courses_authorid_fkey FOREIGN KEY (authorid) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//                    );
//         CREATE TABLE IF NOT EXISTS lectures (
//                   id SERIAL PRIMARY KEY,
//                   title VARCHAR(255) NOT NULL,
//                   videourl VARCHAR(255),
//                   publicid VARCHAR(255),
//                   course_id INTEGER NOT NULL,
//                   ispreviewfree BOOLEAN,
//                   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//                   CONSTRAINT lectures_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//                 );
        
//            CREATE TABLE IF NOT EXISTS purchases (
//                     id SERIAL PRIMARY KEY,
//                     course_id INTEGER NOT NULL,
//                     user_id INTEGER NOT NULL,
//                     amount NUMERIC NOT NULL,
//                     payment_id VARCHAR(200) NOT NULL,
//                     status course_status NOT NULL DEFAULT 'pending',
//                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                     CONSTRAINT purchase_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
//                     CONSTRAINT purchase_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//                   );
//            CREATE TABLE IF NOT EXISTS lecture_progress (
//                     id SERIAL PRIMARY KEY,
//                     lecture_id INTEGER NOT NULL,
//                     course_id INTEGER NOT NULL,
//                     user_id INTEGER NOT NULL,
//                     viewed BOOLEAN NOT NULL,
//                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                     FOREIGN KEY (lecture_id) REFERENCES lectures(id),
//                     FOREIGN KEY (user_id) REFERENCES Users(id)
//                   );
//            CREATE TABLE IF NOT EXISTS course_progress (
//                      id SERIAL PRIMARY KEY,
//                      user_id INTEGER NOT NULL,
//                      course_id INTEGER NOT NULL,
//                      completed BOOLEAN NOT NULL,
//                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                      CONSTRAINT course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
//                      CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//                    );
           
// `

//         })


//         console.log('Database initialized successfully!');

//     } catch (error) {
//         console.error('Error initializing the database:', error);
//         process.exit(1); // Exit the process if database initialization fails
//     }
// }

// export const initializeDB = async () => {
//     try {
//       // Begin transaction
//       await sql.begin(async (sql) => {
//         // Create custom types
//         await sql`
//           DO $$
//           BEGIN
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
//               CREATE TYPE user_role AS ENUM ('student', 'instructor');
//             END IF;
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
//               CREATE TYPE course_level AS ENUM ('beginner', 'medium', 'advance');
//             END IF;
//             IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_status') THEN
//               CREATE TYPE course_status AS ENUM ('complete', 'pending', 'failed');
//             END IF;
//           END $$ LANGUAGE plpgsql;
//         `;
  
//         // Create tables
//         await sql`
//           CREATE TABLE IF NOT EXISTS Users (
//             id SERIAL PRIMARY KEY,
//             username VARCHAR(50) NOT NULL,
//             email VARCHAR(100) UNIQUE NOT NULL,
//             password VARCHAR(255) NOT NULL,
//             role user_role DEFAULT 'student',
//             photo_url VARCHAR(255),
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//           );
  
//           CREATE TABLE IF NOT EXISTS Courses (
//             id SERIAL PRIMARY KEY,
//             title VARCHAR(255) NOT NULL,
//             subtitle VARCHAR(255),
//             category VARCHAR(50) NOT NULL,
//             description VARCHAR(1000),
//             courseprice NUMERIC,
//             level course_level DEFAULT 'beginner',
//             coursethumbnail VARCHAR(255),
//             ispublished BOOLEAN DEFAULT false,
//             authorid INTEGER NOT NULL,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             CONSTRAINT courses_authorid_fkey FOREIGN KEY (authorid) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//           );
  
//           CREATE TABLE IF NOT EXISTS lectures (
//             id SERIAL PRIMARY KEY,
//             title VARCHAR(255) NOT NULL,
//             videourl VARCHAR(255),
//             publicid VARCHAR(255),
//             course_id INTEGER NOT NULL,
//             ispreviewfree BOOLEAN,
//             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//             CONSTRAINT lectures_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//           );
  
//           CREATE TABLE IF NOT EXISTS purchases (
//             id SERIAL PRIMARY KEY,
//             course_id INTEGER NOT NULL,
//             user_id INTEGER NOT NULL,
//             amount NUMERIC NOT NULL,
//             payment_id VARCHAR(200) NOT NULL,
//             status course_status NOT NULL DEFAULT 'pending',
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             CONSTRAINT purchase_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
//             CONSTRAINT purchase_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//           );
  
//           CREATE TABLE IF NOT EXISTS lecture_progress (
//             id SERIAL PRIMARY KEY,
//             lecture_id INTEGER NOT NULL,
//             course_id INTEGER NOT NULL,
//             user_id INTEGER NOT NULL,
//             viewed BOOLEAN NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (lecture_id) REFERENCES lectures(id),
//             FOREIGN KEY (user_id) REFERENCES Users(id)
//           );
  
//           CREATE TABLE IF NOT EXISTS course_progress (
//             id SERIAL PRIMARY KEY,
//             user_id INTEGER NOT NULL,
//             course_id INTEGER NOT NULL,
//             completed BOOLEAN NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             CONSTRAINT course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
//             CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
//           );
//         `;
//       });
  
//       console.log('Database initialized successfully!');
//     } catch (error) {
//       console.error('Error initializing the database:', error);
//       process.exit(1); // Exit the process if database initialization fails
//     }
//   };
  

export const initializeDB = async () => {
    try {
      // Begin transaction
      await sql.begin(async (sql) => {
        // Create custom types
        await sql`
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
              CREATE TYPE user_role AS ENUM ('student', 'instructor');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
              CREATE TYPE course_level AS ENUM ('beginner', 'medium', 'advance');
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_status') THEN
              CREATE TYPE purchase_status AS ENUM ('complete', 'pending', 'failed');
            END IF;
          END $$ LANGUAGE plpgsql;
        `;
  
        // Create Users table
        await sql`
          CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role user_role DEFAULT 'student',
            photo_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
  
        // Create Courses table
        await sql`
          CREATE TABLE IF NOT EXISTS Courses (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255),
            category VARCHAR(50) NOT NULL,
            description VARCHAR(1000),
            courseprice NUMERIC,
            level course_level DEFAULT 'beginner',
            coursethumbnail VARCHAR(255),
            ispublished BOOLEAN DEFAULT false,
            authorid INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT courses_authorid_fkey FOREIGN KEY (authorid) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
          );
        `;
  
        // Create lectures table
        await sql`
          CREATE TABLE IF NOT EXISTS lectures (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            videourl VARCHAR(255),
            publicid VARCHAR(255),
            course_id INTEGER NOT NULL,
            ispreviewfree BOOLEAN,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT lectures_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
          );
        `;
  
        // Create purchases table
        await sql`
          CREATE TABLE IF NOT EXISTS purchases (
            id SERIAL PRIMARY KEY,
            course_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            amount NUMERIC NOT NULL,
            payment_id VARCHAR(200) NOT NULL,
            status purchase_status NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT purchase_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT purchase_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
          );
        `;
  
        // Create lecture_progress table
        await sql`
          CREATE TABLE IF NOT EXISTS lecture_progress (
            id SERIAL PRIMARY KEY,
            lecture_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            viewed BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lecture_id) REFERENCES lectures(id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
          );
        `;
  
        // Create course_progress table
        await sql`
          CREATE TABLE IF NOT EXISTS course_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            completed BOOLEAN NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
            CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
          );
        `;
      });
  
      console.log('Database initialized successfully!');
    } catch (error) {
      console.error('Error initializing the database:', error);
      process.exit(1); // Exit the process if database initialization fails
    }
  };
  





// Export `sql` for application use
// module.exports = sql;
export default sql