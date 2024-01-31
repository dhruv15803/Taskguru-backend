import { Completed } from "../models/completed.model.js";
import { Task } from "../models/task.model.js";
import jwt, { decode } from 'jsonwebtoken'
import { UpcomingTask } from "../models/upcomingTask.model.js";

const addTask  = async (req,res)=>{
    const {id,title,description} = req.body;
    if(title===""){
        res.status(400).json({
            "success":false,
            "message":"Please enter a task title"
        })
        return;
    }
    if(!req.cookies){
        res.json({
            "success":false,
            "message":"Need to be logged in to add task"
        })
        return;
    }
    console.log(req.cookies);
    const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
    const _id = decodedToken._id;
    const task = await Task.create({id,title,description,createdBy:_id});
    res.status(200).json({
        "success":true,
        "message":"successfully added a task",
        task,
    })
    console.log(task);
}

const getAllTasks = async (req,res)=>{
    try {
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"Need to be logged in to get all tasks"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const userTasks = await Task.find({createdBy:decodedToken._id});
        res.status(200).json({
            "success":true,
            userTasks,
        })   
    } catch (error) {
        console.log(error);
    }
}


const deleteTask = async (req,res)=>{
try {
        const {id} = req.body;
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"Need to be logged in to get all tasks"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const deletedTask = await Task.deleteOne({id,createdBy:decodedToken._id});
        console.log(deletedTask);
        res.status(200).json({
            "success":true,
            "message":"task successfully deleted",
        })
} catch (error) {
    console.log(error);
}
}


const updateTask = async (req,res)=>{
try {
        const {id,newTitle,newDescription} = req.body;
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"Need to be logged in to get all tasks"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const updatedTask = await Task.updateOne({id,createdBy:decodedToken._id},{$set:{title:newTitle,description:newDescription}});
        console.log(updatedTask);
        res.status(200).json({
            "success":true,
            "message":"task successfully updated"
        })
} catch (error) {
    console.log(error);
}
}


const clearAllTasks = async (req,res)=>{
try {
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"Need to be logged in to get all tasks"
            })
            return;
        }
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const deleteAll = await Task.deleteMany({createdBy:decodedToken._id});
        res.status(200).json({
            "success":true,
            "message":"deleted all the tasks of the logged in user"
        })
        console.log(deleteAll);
} catch (error) {
    console.log(error);
}
}


const completeTask = async (req,res)=>{
try {
        if(!req.cookies){
            res.json({
                "success":false,
                "message":"Need to be logged in to get all tasks"
            })
            return;
        }
        const {id} = req.body;
        const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
        const taskToBeCompleted = await Task.findOne({id,createdBy:decodedToken._id});
        const upcomingTaskToBeCompleted = await UpcomingTask.findOne({id,createdBy:decodedToken._id});
        let completedTask;
        let deletedTaskAfterCompletion;
        if(!taskToBeCompleted){
            completedTask = await Completed.create({id,title:upcomingTaskToBeCompleted.title,description:upcomingTaskToBeCompleted.description,dueDate:upcomingTaskToBeCompleted.dueDate,
            overdue:upcomingTaskToBeCompleted.overdue,completedBy:decodedToken._id});
            deletedTaskAfterCompletion = await UpcomingTask.deleteOne({id});
        } else{
            completedTask = await Completed.create({id,title:taskToBeCompleted.title,description:taskToBeCompleted.description,completedBy:decodedToken._id});
            deletedTaskAfterCompletion = await Task.deleteOne({id});
        }
        console.log(deletedTaskAfterCompletion);
        res.status(200).json({
            "success":true,
            completedTask,
        })
} catch (error) {
    console.log(error);
}
}


const getAllCompleted = async (req,res)=>{
    if(!req.cookies){
        res.json({
            "success":false,
            "message":"Need to be logged in to get all tasks"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
    const completedTasks = await Completed.find({completedBy:decodedToken._id});
    res.status(200).json({
        "success":true,
        completedTasks,
    })
}


const clearCompleted = async (req,res)=>{
    if(!req.cookies){
        res.json({
            "success":false,
            "message":"Need to be logged in to get all tasks"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies.accessToken,process.env.JWT_SECRET);
    const deleteAllCompleted = await Completed.deleteMany({completedBy:decodedToken._id});
    console.log(deleteAllCompleted);
    res.status(200).json({
        "success":true,
        "message":"cleared completed tasks"
    })
}

export {addTask,getAllTasks,deleteTask,updateTask,clearAllTasks,completeTask,getAllCompleted,clearCompleted};
