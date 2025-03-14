import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);

export default router;
