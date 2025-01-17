import express from 'express';
import bodyParser from 'body-parser';   
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import  orderRouter  from './routes/orderRoute.js';
import path  from 'path';
import { fileURLToPath } from "url";



// Define __filename and __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app.config
const app = express();
const port=process.env.PORT||4000;

//middleware 
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//db connection

connectDB()



//api endpoints
app.use("/api/food",foodRouter)
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)




app.get('/', (req, res) =>{
    res.send('Hello World')
})




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)

})