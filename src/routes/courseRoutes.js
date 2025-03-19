"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/", courseController_1.getCourses);
router.post("/", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, courseController_1.createCourse);
router.post("/enroll", authMiddleware_1.authenticate, courseController_1.enrollInCourse);
router.delete("/:id", authMiddleware_1.authenticate, authMiddleware_1.isAdmin, courseController_1.deleteCourse);
exports.default = router;
