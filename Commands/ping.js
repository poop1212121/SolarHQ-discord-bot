const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(
        `Latency is ${Date.now() - interaction.createdTimestamp}ms.`,
      )
      .setColor("Blue");

    await interaction.reply({ embeds: [embed] });
  },
};
