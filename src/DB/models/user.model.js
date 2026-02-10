import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, 'name must be at least 2 characters'],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'password must be at least 6 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: [18, 'Age must be 18 or older'],
        max: [60, 'Age must be 60 or younger'],
    },
}, {
    strictQuery: true,
    timestamps: true,
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
userModel.syncIndexes()

export default userModel