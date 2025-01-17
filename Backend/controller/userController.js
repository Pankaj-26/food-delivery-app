import userModel from "../models/userModel.js";    
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from 'dotenv'

dotenv.config()

//login

const loginUser=async(req,res)=>{

    const {email,password}=req.body;

    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"User Doesn't Exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        const token=createToken(user._id);

        res.status(200).json({success:true,token})

    }catch(e){
        console.log(e)
        res.status(500).json({success:false,message:"Internal server error"})
    }

}


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

//register  

const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const exist=await userModel.findOne({email})

        if(exist){
            return res.status(400).json({success:false,message:"User already exists"})
        }

      if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter valid email"})
      } 

        if(password.length<6){
            return res.status(400).json({success:false,message:"Password must be atleast 6 characters"})
        }

        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)

        const newUser= new userModel({
            name,
            email,
            password:hashPassword
        })

        const user=await newUser.save();

        const token=createToken(user._id)

        res.status(200).json({success:true,token,user})
    


    }catch(e){
        console.log(e)
        res.status(500).json({success:false,message:"Internal server error"})

    }

}


export {registerUser,loginUser}