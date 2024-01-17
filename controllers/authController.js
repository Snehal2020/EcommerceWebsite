const jwt = require('jsonwebtoken')
const User=require('../models/userModel')
const bcrypt= require('bcrypt')
const userModel=require("../models/userModel")
const orderModel=require("../models/orderModel")


const registerController=async (req, res) => {
    const { name, email, phone, address,role, password, cpassword } = req.body
   
    try {
        if (!name || !email || !phone || !address || !role || !password || !cpassword) {
            res.send({message:"Please fill the complete details"})
        }
        const userdata =await User.findOne({ email: email });
        if (userdata) {
            return res.status(200).send(
                {success:true,
                message:"User is alraedy exist"})
        }
        else if(password!=cpassword){
            return res.send("enter correct password")
        }
        
        var userd = new User(req.body)
        
         await userd.save();
         res.status(201).send({success:true,message:"user registered successfully"})
    } catch (error) {
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}

const loginController=async (req,res)=>{
    const {email,password}=req.body
    if(!email||!password)
    {
       return res.send("enter complete details")
    }
    try {
        const userdata=await User.findOne({email:email});
       
        if(!userdata){
            
           return res.send("User not found")
        }
        else{
          
            const isMathch=await bcrypt.compare(req.body.password,userdata.password)
            console.log(userdata.password)
            console.log(isMathch)
            if(!isMathch)
            {
                res.send("Invalid user details")    
            }
            else{
                const token =await userdata.generateToken();
                console.log(token)
                res.cookie("Mytoken",token,{httpOnly:true})
                res.status(200).send({success:true,message:"login successful",token:token,user:userdata,role:userdata.role})
            }
        }

    } catch (error) {
        console.log(error)
       res.status(500).send({
        success:false,
        message:"Error in login",
        error
       })
    }
}
const updateProfileController = async (req, res) => {
    try {
      const { name, email, password,cpassword, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      // if (password && password.length < 6) {
      //   return res.json({ error: "Passsword is required and 6 character long" });
      // }
      // const hashedPassword = password ? await hashPassword(password) : undefined;
      let hpassword=await bcrypt.hash(password,12)
     console.log(hpassword)
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          email:email||user.email,
          password: hpassword || user.password,
          cpassword: hpassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };
 const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  //orders
  const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };

module.exports ={getAllOrdersController,orderStatusController,getOrdersController,registerController,loginController,updateProfileController};