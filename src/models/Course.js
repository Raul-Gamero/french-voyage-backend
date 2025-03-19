"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSchema = new mongoose_1.default.Schema({
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    description: String
});
exports.default = mongoose_1.default.model('Course', CourseSchema);
