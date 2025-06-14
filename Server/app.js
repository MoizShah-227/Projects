import express from 'express'
import authRoute from './Routes/authRoute.js';
import cors from 'cors';

const app = express()

app.use(cors({origin:"http://localhost:3000",credentials:true}));    ///this for frontend

app.use(express.json());

app.use('/api',authRoute);
app.listen(5000,()=>{
    console.log("server is Runing")
})
