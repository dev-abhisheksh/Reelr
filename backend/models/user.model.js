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
            type: String, //cloudinary link
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
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    },
    { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


export const User = mongoose.model("User", userSchema);
