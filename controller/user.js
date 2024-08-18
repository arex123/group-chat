exports.register =async (req,res,next)=>{
    try{
        const {username, email, phone, password} = req.body;
        console.log("req.body :  ",req.body)

        // const existingUser = await UserModel.findOne({where: {email: email}});
        // if(existingUser){
        //     return res.status(400).json({message: "Email already exists.\nKindly login with your credentials"});
        // }

        // const hash = await bcrypt.hash(password, 10);
        // await UserModel.create({username: username, email: email, phone: phone, password: hash});
        // res.status(201).json({message: "User account created. \nPlease sign-in to continue"});
    }
    catch(err){
        console.log('SignUp-Error: ',err);
        // res.status(500).json({error: err, message: "something went wrong"})
    }
}