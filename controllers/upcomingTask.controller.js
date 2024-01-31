import jwt from 'jsonwebtoken';
import { UpcomingTask } from '../models/upcomingTask.model.js';


const addUpcomingTask = async (req,res)=>{
try {
        const {id,title,description,dueDate,overdue} = req.body;
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        if(title===""){
            res.json({
                "success":false,
                "message":"please enter a task title",
            })
            return;
        }
        const user = await UpcomingTask.create({id,title,description,createdBy:decodedToken._id,dueDate,overdue});
        res.status(201).json({
            "success":true,
            user,
        })
} catch (error) {
    console.log("upcoming task create error ",error);
}
}

const getAllUpcomingTasks = async (req,res)=>{
try {
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"need to be logged in to get all upcoming tasks"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
        const upcomingTasks = await UpcomingTask.find({createdBy:decodedToken._id});
        res.status(200).json({
            "success":true,
            "data":upcomingTasks,
        })
} catch (error) {
    console.log('fetching error ',error);
}
}

const deleteUpcomingTask = async (req,res)=>{
    if(!req.cookies){
        res.json({
            "success":false,
            "message":"need to be logged in to delete upcoming tasks"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
    const {id} = req.body;
    const deletedUpcomingTask = await UpcomingTask.deleteOne({id,createdBy:decodedToken._id});
    console.log(deletedUpcomingTask);
    res.status(200).json({
        "success":true,
        "message":"Deleted task successfully",
    })
}


const updateUpcomingTask = async (req,res)=>{
    if(!req.cookies){
        res.json({
            "success":false,
            "message":"need to be logged in to delete upcoming tasks",
        })
        return;
    }
    const {id,newTitle,newDescription,newDueDate,newOverDue} = req.body;
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
    const newTask  = await UpcomingTask.updateOne({id,createdBy:decodedToken._id},{$set:{title:newTitle,description:newDescription,dueDate:newDueDate,overdue:newOverDue}});
    console.log(newTask);
    res.status(200).json({
        "success":true,
        "message":"upcoming task successfully updated"
    })
}

const clearUpcoming = async (req,res)=>{
try {
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"need to be logged in to delete upcoming tasks",
            })
            return;
        }    
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const clearUpcoming = await UpcomingTask.deleteMany({createdBy:decodedToken._id});
        console.log(clearUpcoming);
        res.status(200).json({
            "success":true,
            "message":"cleared upcoming tasks",
        })
} catch (error) {
    console.log(error);
}
}



export {addUpcomingTask,getAllUpcomingTasks,deleteUpcomingTask,updateUpcomingTask,clearUpcoming};