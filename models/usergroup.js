const Sequelize = require('sequelize')

const sequelize = require('../utils/database')
const UserGroup = sequelize.define('UserGroup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    role: {
        type: Sequelize.STRING,  // Role in the group, e.g., 'admin', 'member'
        allowNull: false,
        defaultValue: 'member'
    },
    userId:{type: Sequelize.STRING},
    groupId:{type: Sequelize.STRING}
})

module.exports = UserGroup