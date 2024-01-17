const jwt = require('jsonwebtoken');
const User=require('../models/userModel')
const requireSignIn=async (req,res,next)=>{
   try {
    const decode=jwt.verify(req.headers.authorization,process.env.SECRET_KEY)
    req.user=decode
    next()
   } catch (error) {
    console.log(error)
   }
}
//admin access

const isAdmin=async (req,res,next)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role!== 1){
            return res.status(401).send({
                success:false,
                message:"unAuthorized acces"
            })
        }
        else{
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports={requireSignIn,isAdmin}