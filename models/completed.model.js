import mongoose from 'mongoose'

const completedSchema = new mongoose.Schema({
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
    dueDate: {
        type:String,
    },
    completedBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    overdue: {
        type:Boolean,
    }
},{timestamps:true});

export const Completed = mongoose.model('Completed',completedSchema);