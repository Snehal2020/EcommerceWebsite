const mongoose = require('mongoose');
require('dotenv').config()
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    phone:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    role:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    token:[{
        token:{
            type:String
        }
    }]
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
         this.password=await bcrypt.hash(this.password,12)
         this.cpassword= await bcrypt.hash(this.cpassword,12)
    }
    next()
})

userSchema.methods.generateToken=async function(){
    try {
      const gToken=Jwt.sign({_id:this._id},process.env.SECRET_KEY);
      this.token=this.token.concat({token:gToken});
      await this.save()
      return gToken
    } catch (error) {
      console.log(error)
    }
}

module.exports=mongoose.model('User',userSchema)

// {
//     "name": "snehal",
//     "email": "Snehal1@",
//     "phone": "123",
//     "address": "abc",
//     "role": "abc",
//     "password": "s1",
//     "cpassword": "s1"
//   }