const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botname")
    .setDescription("Get the bot's name."),

  async execute(interaction) {
    await interaction.reply(`My name is ${interaction.client.user.username}`);
  },
};
