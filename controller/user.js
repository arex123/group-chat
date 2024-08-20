const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const { Op } = require('sequelize');

exports.register =async (req,res,next)=>{
    try{
        const {name, email, phone, password} = req.body;
        console.log("req.body :  ",req.body,name, email, phone, password)

        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if(existingUser){
            return res.status(400).json({success:false,message: "User with given Email or phone already exists."});
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({name: name, email: email, phone: phone, password: hash});
        res.status(201).json({success:true,message: "User account created. \nPlease sign-in to continue"});
    }
    catch(err){
        console.log('SignUp-Error: ',err);
        res.status(500).json({success:false,error: err, message: "something went wrong"})
    }
}

exports.login = async(req,res,next)=>{
    let {email,password} = req.body
    console.log("req, body: ",email,password)
    User.findAll({where:{email:email}}).then(user=>{
        if(user.length==0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            user = user[0]
            console.log("user from db ",user.password)

            //comparing password with has in db
            bcrypt.compare(password,user.password).then(result=>{
                console.log("rsult ",result,"user.id: ",user.id)
                if(result==false){
                    res.status(401).json({
                        success:false,
                        message:"User Not Authorized"
                    })
                }else{

                    //create jwt token now
                    console.log("secret key ",process.env.tokenSecret)
                    var token = jwt.sign({ id: user.id }, process.env.tokenSecret);
                    res.status(200).json({
                        success:true,
                        message:"User is succesfuly logged in",
                        token:token
                    })

                }
            })


        }
    })
}

exports.getAllUsers = async(req,res)=>{
    try{

        let users = await User.findAll({
            where:{
                id: {
                    [Op.not]: req.user.id
                }
            },
            attributes:[
                'id',
                'name'
            ]
        })

        res.json(users)
    }catch(err){
        res.status(500).json({error:"Error while fetching users"})
    }
}