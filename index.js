import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import postgres from 'postgres'
import cookieParser from 'cookie-parser'




// Routers
import userRoute from './routes/signInRoute.js'
import courseRoute from "./routes/coursesRoute.js"
import isAuthenticated from './middlewares/isAuthenticated.js'








// dot env filels 
dotenv.config()

// initilizing the app
const app = express();



// default middleware

app.use(express.json())
app.use(cookieParser())


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))




// port 
const PORT = process.env.PORT || 4242;




// routes

app.use('/api/v1/user', userRoute)
app.use('/api/v1/courses', isAuthenticated, courseRoute)


app.get('/', async (_, res) => {
  const sql = postgres(`${process.env.DATABASE_URL}`);
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});






app.listen(PORT, () => {
  console.log(`Server Listening to http://localhost:${PORT}`);
});