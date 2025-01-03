export const users_table = `CREATE TABLE IF NOT EXISTS Users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role user_role DEFAULT 'student',
          photo_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`


export const courses_table = `CREATE TABLE IF NOT EXISTS Courses (
          id BIGSERIAL PRIMARY KEY,
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
        );`


export const lectures_table = ` CREATE TABLE IF NOT EXISTS lectures (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          videourl VARCHAR(255),
          publicid VARCHAR(255),
          course_id INTEGER NOT NULL,
          ispreviewfree BOOLEAN,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT lectures_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        );`



export const purchase_table = `CREATE TABLE IF NOT EXISTS purchases (
          id BIGSERIAL PRIMARY KEY,
          course_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          amount NUMERIC NOT NULL,
          payment_id VARCHAR(200) NOT NULL,
          status purchase_status NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT purchase_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
          CONSTRAINT purchase_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        );`

export const lecture_progress_table = `  CREATE TABLE IF NOT EXISTS lecture_progress (
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
        );`


export const course_progress_table = `CREATE TABLE IF NOT EXISTS course_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          course_id INTEGER NOT NULL,
          completed BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT course_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE NO ACTION ON DELETE NO ACTION,
          CONSTRAINT course_progress_course_id_fkey FOREIGN KEY (course_id) REFERENCES Courses (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        );`




// Types


export const user_role_type = `CREATE TYPE user_role AS ENUM ('student', 'instructor');`

export const purchase_status_type = ` CREATE TYPE course_status AS ENUM ('complete', 'pending', 'failed');`

export const course_level_type = ` CREATE TYPE course_level AS ENUM ('beginner', 'medium', 'advance');`