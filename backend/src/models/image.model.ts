import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

export const Image = mongoose.model("Image", imageSchema);
