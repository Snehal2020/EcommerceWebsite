const express = require('express');
const app=express()
require('dotenv').config() 
require('./config/db');
const cors=require('cors')
const authRoute=(require('./routes/authRoute'))
const categoryRoutes =require('./routes/categoryRoutes')
const productRoutes =require('./routes/productRoutes')
const path =require('path')
app.use(express.static(path.join(__dirname,'./client/build')))
app.use(authRoute)
app.use("/category",categoryRoutes)
app.use("/product",productRoutes)
app.use(express.json())
app.use(cors())
// app.get('*', function(req, res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'))
//   })



  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });