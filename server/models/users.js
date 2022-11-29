import mongoose from "mongoose";
// import { boolean } from "webidl-conversions";
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    verifyToken: {
        email: {
            type: String,
            required: true
        },
        sms: {
            type: String,
            required: true
        }
    },

    userVerified: {
        email: {
            type: Boolean,
            default: false
        },
        sms: {
            type: Boolean,
            default: false
        }
    },
    tasks: [
        {
            taskname: {
                type: String,
                required: true
            },
            deadline: {
                type: Date,
                required: true
            },
            isCompleted: {
                type: Boolean,
                default: false
            },
            notificationType: {
                type: String,
                required: true
            },
            reminders : {
                type : Array
            }
        }
    ]
});
const userModel = mongoose.model("Users", userSchema, "users");
export default userModel;
