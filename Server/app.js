import express from 'express';
import authRoute from './Routes/authRoute.js';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  "http://localhost:3000",         // React dev (default)
  "https://localhost",             // React dev with HTTPS
  "capacitor://localhost",         // Mobile APK
  "http://localhost",              // Android emulator
  undefined                        // Mobile apps / curl
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api', authRoute);

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
