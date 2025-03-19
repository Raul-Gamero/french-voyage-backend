import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, phone, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        // Asegurar que el password no es undefined
        if (!password) return res.status(400).json({ message: "La contraseña es obligatoria" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, phone, email, password: hashedPassword });

        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Público
 */
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const token = generateToken(user._id.toString(), user.role);

        res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en login", error });
    }
};

/**
 * @desc    Obtener el perfil del usuario autenticado
 * @route   GET /api/auth/profile
 * @access  Privado (Solo usuarios autenticados)
 */
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "No autorizado" });

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        res.status(500).json({ message: "Error al obtener el perfil", error });
    }
};

/**
 * @desc    Actualizar perfil del usuario autenticado
 * @route   PUT /api/auth/profile
 * @access  Privado (Solo usuarios autenticados)
 */
export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "No autorizado" });

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Perfil actualizado correctamente",
            user: {
                id: updatedUser._id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        res.status(500).json({ message: "Error al actualizar el perfil", error });
    }
};
