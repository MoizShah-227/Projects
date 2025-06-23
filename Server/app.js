import express from 'express'
import authRoute from './Routes/authRoute.js';
import cors from 'cors';

const app = express()

// app.use(cors({origin:"http://localhost:3000",credentials:true}));    ///this for frontend
const allowedOrigins = [
  "http://localhost:3000",           // React dev
  "capacitor://localhost",           // Android/iOS Capacitor apps
  "http://localhost",                // sometimes used in emulators
  "https://projects-1-7vmq.onrender.com" // your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api',authRoute);
app.listen(5000,()=>{
    console.log("server is Runing")
})
