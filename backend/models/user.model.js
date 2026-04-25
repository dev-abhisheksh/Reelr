import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is must"],
            trim: true,
        },
        profileImage: {
            type: String,
        },
        coverImage: {
            type: String
        },
        role: {
            type: String, 
            enum: ["viewer", "creator", "admin"],
            default: "creator",
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 200,
        },

        isPrivate: {
            type: Boolean,
            default: false,
        },

        followersCount: {
            type: Number,
            default: 0
        },
        followingCount: {
            type: Number,
            default: 0
        }

    },
    { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


export const User = mongoose.model("User", userSchema);
