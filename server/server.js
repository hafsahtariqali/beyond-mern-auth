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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://beyond-mern-auth.vercel.app",
      "https://beyond-mern-auth-production.up.railway.app"
    ];

    const isVercelPreview = origin?.includes(".vercel.app");

    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//API endpoints
app.get('/', (req, res) => {res.send("API is Working.")})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));