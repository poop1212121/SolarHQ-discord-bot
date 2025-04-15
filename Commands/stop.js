const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the current song and clear the queue."),

  async execute(interaction) {
    const player = interaction.client.players.get(interaction.guild.id);
    if (player) {
      player.stop();
    }

    await interaction.reply(
      "🛑 The music has been stopped and the queue is cleared.",
    );
  },
};
