const express = require("express")
const mongoose = require("mongoose")
const app = express();
const PORT = 3000;
const {MONGOURI} = require("./key");
const router = require("./Routes/auth");
app.use(express.json())


mongoose.connect(MONGOURI)

mongoose.connection.on("connected", ()=>{
    console.log("MongoDB Authorization DB connected")
})
mongoose.connection.on("error", (error)=>{
    console.log(error)
})
require('./Models/usermodel')

app.use(router)



app.listen(PORT, ()=>{
    console.log(`App Running successfully on  ${PORT}`)
})
