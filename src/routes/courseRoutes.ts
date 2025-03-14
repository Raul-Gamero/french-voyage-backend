import express from "express";
import {
    getCourses,
    createCourse,
    enrollInCourse,
    deleteCourse
} from "../controllers/courseController";
import { authenticate, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getCourses);

router.post("/", authenticate, isAdmin, createCourse);

router.post("/enroll", authenticate, enrollInCourse);

router.delete("/:id", authenticate, isAdmin, deleteCourse);

export default router;
