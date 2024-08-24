const Chat = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const sequelize = require("../utils/database");

const { Op } = require("sequelize");
const { CronJob } = require("cron");

const ArchivedChat = require("../models/archivedChat");

const archiveCronJob = new CronJob(
    "0 0 * * *",
    function () {
      archiveChats();
    },
    null,
    false,
    "Asia/Kolkata"
  );


async function archiveChats() {
  let t;
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const oldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: date,
        },
      },
    });
    t = await sequelize.transaction();

    for (const chat of oldChats) {
      await ArchivedChat.create(
        {
          id: chat.id,
          message: chat.message,
          isFile: chat.isFile,
          createdAt: chat.createdAt,
          userId: chat.userId,
          groupId: chat.groupId,
        },
        { transaction: t }
      );

      await chat.destroy({ transaction: t });
    }

    console.log("on date:", new Date());
    console.log(
      "chats got archived , and length of chats archived is:",
      oldChats.length
    );
    await t.commit();
  } catch (err) {
    // if (t) await t.rollback();
    console.error(`cron-job-date: ${date} ArchiveChatDelete-Error: `, err);
  }
}

module.exports = archiveCronJob