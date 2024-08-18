const User = require("../models/user");
const bcrypt = require('bcrypt')

exports.register =async (req,res,next)=>{
    try{
        const {name, email, phone, password} = req.body;
        console.log("req.body :  ",req.body,name, email, phone, password)

        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser){
            return res.status(400).json({message: "Email already exists."});
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({name: name, email: email, phone: phone, password: hash});
        res.status(201).json({message: "User account created. \nPlease sign-in to continue"});
    }
    catch(err){
        console.log('SignUp-Error: ',err);
        res.status(500).json({error: err, message: "something went wrong"})
    }
}

exports.login = async(req,res,next)=>{
    let {email,password} = req.body
    console.log("req, body: ",email,password)
}