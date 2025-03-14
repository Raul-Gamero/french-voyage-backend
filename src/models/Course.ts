import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    description: String
});

export default mongoose.model('Course', CourseSchema);
