import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        subscribed: {
            type: Boolean,
            default: false
        }
    },
);

export default mongoose.model("User", UserSchema);