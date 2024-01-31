import mongoose from 'mongoose'


const upcomingTaskSchema = new mongoose.Schema({
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
        ref: "User",
    },
    dueDate: {
        type:String,
        required:true,
    },
    overdue: {
        type:Boolean,
        required:true,
    }
},{timestamps:true});

export const UpcomingTask = mongoose.model('UpcomingTask',upcomingTaskSchema);
