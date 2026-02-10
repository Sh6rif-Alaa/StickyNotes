import mongoose, { Types } from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, 'title must be at least 2 characters'],
        validate: {
            validator: function (v) {
                return v !== v.toUpperCase();
            },
            message: "title can't be entirely uppercase"
        }
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: "user"
    }
}, {
    strictQuery: true,
    timestamps: true,
})

const noteModel = mongoose.models.note || mongoose.model('note', noteSchema)
noteModel.syncIndexes()

export default noteModel