const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require('../key')
const User = require('../Models/usermodel')


router.get("/auth", (req, res)=>{
    res.send("Get request")
})

router.post("/auth/signup", (req, res)=>{
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(422).json({ error: "Kindly check and fill all the fields" })
    }
    User.findOne({ email: email }).then((saveduser) => {
            if (saveduser) {
                res.status(422).json({ error: "Kindly check Email already exists" })
            } 
            bcrypt.hash(password, 12).then((hashedpaswword)=>{

                const user = new User({
                        name,
                        email,
                        password : hashedpaswword
                })
                user.save().then(user => { res.json({message : "SignUp successfull"}) }).catch(err => { console.log(err) })

            })
            
    }).catch((err) => { console.log(err) })
})

router.post("/auth/login", (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
       return res.status(422).json({error : "Kindly fill Email or Password"})
    }
    User.findOne({email:email}).then(saveduser=>{
        if(!saveduser){
            return res.status(400).json({error : "Invalid email or password"})
        }
        bcrypt.compare(password, saveduser.password).then(doMatch =>{
            if(doMatch){
                // res.status(200).json({ Message : "SignedIn Successfully"})
                const token = jwt.sign({_id : saveduser._id}, JWT_SECRET) // generating token based on id
                const {_id, name, email} = saveduser        // destructuring
                res.json({token, user:{_id, name, email}}) // sending token as response
            }
            else{
                return res.status(400).json({error : "Invalid email or password"})
            }
        }).catch(err=>{ console.log(err)})
    })
})


module.exports = router;