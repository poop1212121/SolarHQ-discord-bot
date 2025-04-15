const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the current song."),

  async execute(interaction) {
    const player = interaction.client.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply("❌ No song is currently playing.");
    }

    player.pause();
    await interaction.reply("⏸ The song has been paused.");
  },
};
