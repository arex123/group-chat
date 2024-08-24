const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
const Chat = sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isImage:{
        type:Sequelize.BOOLEAN,
        allowNull:true,
        defaultValue:0
    },
    messageOwner:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Chat