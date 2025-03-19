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
exports.updateUserProfile = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phone, email, password } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "El usuario ya existe" });
        const user = yield User_1.default.create({ firstName, lastName, phone, email, password });
        const token = (0, generateToken_1.default)(user._id.toString(), user.role);
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
    }
    catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
});
exports.registerUser = registerUser;
/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Público
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Verificar si el usuario existe
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }
        // Generar token
        const token = (0, generateToken_1.default)(user._id.toString(), user.role);
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
    }
    catch (error) {
        res.status(500).json({ message: "Error en login", error });
    }
});
exports.loginUser = loginUser;
/**
 * @desc    Obtener el perfil del usuario autenticado
 * @route   GET /api/auth/profile
 * @access  Privado (Solo usuarios autenticados)
 */
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el perfil", error });
    }
});
exports.getUserProfile = getUserProfile;
/**
 * @desc    Actualizar perfil del usuario autenticado
 * @route   PUT /api/auth/profile
 * @access  Privado (Solo usuarios autenticados)
 */
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = yield bcryptjs_1.default.hash(req.body.password, 10);
        }
        const updatedUser = yield user.save();
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
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el perfil", error });
    }
});
exports.updateUserProfile = updateUserProfile;
