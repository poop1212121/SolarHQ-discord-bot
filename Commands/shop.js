const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to the next song in the queue."),

  async execute(interaction) {
    const player = interaction.client.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply("❌ No song is currently playing.");
    }

    player.stop();
    await interaction.reply("⏭ Song skipped.");
  },
};
