import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model('User', UserSchema);
