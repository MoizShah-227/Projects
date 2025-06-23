import express from 'express';
import authRoute from './Routes/authRoute.js';
import cors from 'cors';

const app = express();

// ✅ Allow all dev and mobile origins
const allowedOrigins = [
  "http://localhost:3000",     // React frontend (dev)
  "capacitor://localhost",     // Android/iOS Capacitor apps
  "http://localhost",          // Android emulators or bare HTTP
  undefined                    // Mobile apps may send no origin at all
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // ✅ Allow
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
