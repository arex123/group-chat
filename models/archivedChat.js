const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database");

const ArchivedChat = sequelize.define("archivedChat",{
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isImage: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    groupId: {
      type: Sequelize.INTEGER,
    },
  },
  { timestamps: false }
);

module.exports = ArchivedChat