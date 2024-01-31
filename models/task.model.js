import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    id: {
        type:String,
        required:true,
    },
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});

export const Task = mongoose.model('Task',taskSchema);