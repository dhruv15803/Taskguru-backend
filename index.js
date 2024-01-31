import express from 'express'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
import mongoose, { connect } from 'mongoose';
import { registerUser,loginUser, getLoggedInUser, userLogout } from './controllers/user.controller.js';
import cookieParser from 'cookie-parser';
import { addTask, clearAllTasks, clearCompleted, completeTask, deleteTask, getAllCompleted, getAllTasks, updateTask } from './controllers/task.controller.js';
import cors from 'cors';
import { addUpcomingTask, clearUpcoming, deleteUpcomingTask, getAllUpcomingTasks, updateUpcomingTask } from './controllers/upcomingTask.controller.js';


const app = express();
const port = process.env.PORT || 5000;


const connectToDb = async  ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log('DB connected');   
    } catch (error) {
        console.log('DB ERROR:- ',error);
    }
}

connectToDb();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
}))

app.get('/',(req,res)=>{
    res.send('Home page');
});

app.post('/user/register',registerUser);
app.post('/user/login',loginUser);
app.get('/user/loggedIn',getLoggedInUser);
app.get('/user/logout',userLogout);

app.post('/tasks/add',addTask);
app.get('/tasks/getAll',getAllTasks);
app.post('/tasks/delete',deleteTask);
app.post('/tasks/update',updateTask);
app.get('/tasks/deleteAll',clearAllTasks);


app.post('/upcomingTasks/add',addUpcomingTask);
app.get('/upcomingTasks/getAll',getAllUpcomingTasks);
app.post('/upcomingTasks/delete',deleteUpcomingTask);
app.post('/upcomingTasks/update',updateUpcomingTask);
app.get('/upcomingTasks/deleteAll',clearUpcoming);


app.post('/tasks/complete',completeTask);
app.get('/tasks/getCompleted',getAllCompleted);
app.get('/tasks/deleteCompleted',clearCompleted);


app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
});


