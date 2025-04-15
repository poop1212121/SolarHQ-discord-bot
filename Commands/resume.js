const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resume the paused song."),

  async execute(interaction) {
    const player = interaction.client.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply("❌ No song is currently playing.");
    }

    player.unpause();
    await interaction.reply("▶️ Resumed the song.");
  },
};
