import express from 'express';
import authRoute from './Routes/authRoute.js';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  "http://localhost:3000",              // React dev
  "capacitor://localhost",              // Android/iOS Capacitor apps
  "http://localhost",                   // Android emulator
  "https://projects-1-7vmq.onrender.com" // Your deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true // ✅ Required if using cookies/session auth
}));

app.use(express.json());

app.use('/api', authRoute);

app.listen(5000, () => {
  console.log("✅ Server is running on port 5000");
});
