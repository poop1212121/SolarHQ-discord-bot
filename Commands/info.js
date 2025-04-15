const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about the bot."),
  async execute(interaction) {
    await interaction.reply(
      "I am a bot created to assist you! Type `/help` to see the list of commands.",
    );
  },
};
