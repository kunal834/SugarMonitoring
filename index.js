import express from "express"
import { connectDB } from "./lib/Mongodb.js";
import userRouter from "./routes/user.js";
import sugarroute from "./routes/sugar.js"
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"


dotenv.config();
const Port = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // Your Frontend URL
  methods: ["GET" , "POST" ,"PUT" , "DELETE"] ,
  credentials: true,               // Required for cookies/session
  
}));
app.use(cookieParser()); // To parse cookies here and there 
app.use(express.json()) // use to read json data
connectDB();

// middlewares 
app.use("/api/users" , userRouter);
app.use("/api/sugar" , sugarroute);


app.listen(Port, "0.0.0.0", () => {
  console.log(`Server is running on port ${Port}`);
});