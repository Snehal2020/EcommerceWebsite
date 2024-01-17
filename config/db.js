const mongoose = require('mongoose');
require('dotenv').config()
const db=process.env.DATABASE
try {
  mongoose.connect(db,{ useNewUrlParser: true }).then(()=>{
    console.log('connected successfully')
  })
} catch (error) {
  console.log(error)
}