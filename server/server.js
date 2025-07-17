import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';

const app = express();

const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://beyond-mern-auth-rmz7leys0-hafsas-projects-cacb6cb0.vercel.app" 
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

//API endpoints
app.get('/', (req, res) => {res.send("API is Working.")})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));