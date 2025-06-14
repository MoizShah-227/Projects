import express, { Router } from 'express';
import { register,login,logout,forgotPassword} from '../Controller/AuthController.js';
const router = express.Router();

// User routes
router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/resetpassword",forgotPassword);




router.post("/logout",logout);

export default router;
