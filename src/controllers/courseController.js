"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.enrollInCourse = exports.createCourse = exports.getCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const User_1 = __importDefault(require("../models/User"));
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_1.default.find();
        res.status(200).json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos", error });
    }
});
exports.getCourses = getCourses;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { level, description } = req.body;
    try {
        const newCourse = new Course_1.default({ level, description });
        yield newCourse.save();
        res.status(201).json({ message: "Curso creado exitosamente", newCourse });
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear el curso", error });
    }
});
exports.createCourse = createCourse;
const enrollInCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.body;
    try {
        const user = yield User_1.default.findById(userId);
        const course = yield Course_1.default.findById(courseId);
        if (!user || !course) {
            return res.status(404).json({ message: "Usuario o curso no encontrado" });
        }
        if (user.courses.includes(courseId)) {
            return res.status(400).json({ message: "El usuario ya está inscrito en este curso" });
        }
        user.courses.push(courseId);
        yield user.save();
        res.status(200).json({ message: "Inscripción exitosa", user });
    }
    catch (error) {
        res.status(500).json({ message: "Error al inscribir en el curso", error });
    }
});
exports.enrollInCourse = enrollInCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield Course_1.default.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        res.status(200).json({ message: "Curso eliminado correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar el curso", error });
    }
});
exports.deleteCourse = deleteCourse;
