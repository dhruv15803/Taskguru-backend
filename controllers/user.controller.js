import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';



const registerUser = async (req,res)=>{
try {
        const {email,username,password} = req.body;
        if(email==="" || username==="" || password===""){
            res.json({
                "success":false,
                "message":"Please enter all the fields",
            })
            return;
        }
        const isUser = await User.findOne({$or:[{username},{email}]});
        if(isUser){
            res.json({
                "success":false,
                "message":"User already exists",
            });
            return;
        }
        const user = await User.create({email,username,password});
        res.json({
            "success":true,
            "message":"successfully registered",
        })
        console.log(user);
} catch (error) {
    console.log('registering error:- ',error);
}
}


const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    if(email==="" || password===""){
        res.json({
            "success":false,
            "message":"Please enter all the fields"
        })
        return;
    }
    // check if the user is registered or not
    const isUserRegistered = await User.findOne({email});
    if(!isUserRegistered){
        res.json({
            "success":false,
            "message":"Please enter correct email and password"
        })
        return;
    }
    // check password
    if(password!==isUserRegistered.password){
        res.json({
            "success":false,
            "message":"incorrect password or email"
        })
        return;
    }
    const token = jwt.sign({
        "_id": isUserRegistered._id,
        email,
        password,
        "username":isUserRegistered.username,
    },process.env.JWT_SECRET);
    if(req.cookies?.accessToken){
        res.json({
            "success":false,
            "message":"user is already logged in"
        })
        return;
    }
    res.cookie('accessToken',token);
    const loggedInUser = await User.findOne({email,password});
    res.status(200).json({
        "success":true,
        "message":"successfully logged in",
        loggedInUser
    })
}

const getLoggedInUser = (req,res)=>{
    if(!req.cookies){
        res.status(200).json({
            "success":false,
            "message":"no logged in user"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET);
    const loggedInUser = {
        "_id":decodedToken._id,
        "username":decodedToken.username,
        "email":decodedToken.email,
        "password":decodedToken.password,
    }
    res.status(200).json({
        "success":true,
        loggedInUser,
    })
}

const userLogout = (req,res)=>{
    // check if user is logged in 
    if(!req.cookies?.accessToken){
        res.json({
            "success":false,
            "message":"user is not logged in"
        })
        return;
    }
    res.clearCookie('accessToken');
    res.status(200).json({
        "success":true,
        "message":"successfully logged out"
    })
}


export {registerUser,loginUser,getLoggedInUser,userLogout};
