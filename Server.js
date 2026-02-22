import express from "express"
import { connectDB } from "./lib/Mongodb.js";
import userRouter from "./routes/user.js";
import sugarroute from "./routes/sugar.js"
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();
const Port = 5000;
const app = express();
app.use(cookieParser()); // To parse cookies here and there 
app.use(express.json()) // use to read json data
connectDB();

// middlewares 
app.use("/api/users" , userRouter);
app.use("/api/sugar" , sugarroute);


app.listen(Port , () =>{
    console.log(`server is running on ${Port}`)
} );