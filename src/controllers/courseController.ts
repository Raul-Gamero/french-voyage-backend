import { Request, Response } from "express";
import Course from "../models/Course";
import User from "../models/User";

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos", error });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    const { level, description } = req.body;

    try {
        const newCourse = new Course({ level, description });
        await newCourse.save();
        res.status(201).json({ message: "Curso creado exitosamente", newCourse });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el curso", error });
    }
};

export const enrollInCourse = async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: "Usuario o curso no encontrado" });
        }

        if (user.courses.includes(courseId)) {
            return res.status(400).json({ message: "El usuario ya está inscrito en este curso" });
        }

        user.courses.push(courseId);
        await user.save();

        res.status(200).json({ message: "Inscripción exitosa", user });
    } catch (error) {
        res.status(500).json({ message: "Error al inscribir en el curso", error });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        res.status(200).json({ message: "Curso eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el curso", error });
    }
};
