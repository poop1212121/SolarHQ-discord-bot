const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debug")
    .setDescription(
      "Display the current bot status, including uptime and errors.",
    ),
  async execute(interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return interaction.reply({
      content: `Bot Uptime: ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
    });
  },
};
