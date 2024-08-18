const express  = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const app = express()
// app.use(express.json())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res) => {
    console.log("hi: ", __dirname, req.url);
    console.log("file pa ",__dirname, `/views${req.url}.html`)
    const fileExists = fs.existsSync(path.join(__dirname, `/views${req.url}.html`));
    console.log("file exist ",fileExists)

    if(req.url === '/'){
        req.url = 'home.html';
        return res.sendFile(path.join(__dirname, `/views/${req.url}`));
    }
    else if(fileExists)
        return res.sendFile(path.join(__dirname, `/views/${req.url}.html`));
    else
        return res.sendFile(path.join(__dirname, `/views/error404.html`));
});

app.listen(process.env.PORT,()=>{
    console.log(`Server running at port ${process.env.PORT}`)
})