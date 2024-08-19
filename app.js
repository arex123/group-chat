const express  = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')


const app = express()

const sequelize = require('./utils/database')

const userRouter = require('./routes/user');
const chatRoutes = require('./routes/chat')


const User = require('./models/user');
const Chat = require('./models/chat');

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))

app.use('/user',userRouter)
app.use(chatRoutes)


app.use((req,res) => {
    // console.log("hi: ", __dirname, req.url);
    console.log("file pa ",__dirname, `/views${req.url}.html`)
    const fileExists = fs.existsSync(path.join(__dirname, `/views${req.url}.html`));
    // console.log("file exist ",fileExists)

    if(req.url === '/'){
        req.url = 'chat-screen.html';
        return res.sendFile(path.join(__dirname, `/views/${req.url}`));
    }
    else if(fileExists)
        return res.sendFile(path.join(__dirname, `/views/${req.url}.html`));
    else
        return res.sendFile(path.join(__dirname, `/views/error404.html`));
});

User.hasMany(Chat)
Chat.belongsTo(User)

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running at port ${process.env.PORT}`)
    })
}).catch(e=>console.log("eerro : ",e))