const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the current song queue."),

  async execute(interaction) {
    const queue = interaction.client.queue.get(interaction.guild.id);
    if (!queue || queue.length === 0) {
      return interaction.reply("🎶 The queue is currently empty.");
    }

    const queueList = queue
      .map((url, index) => `**${index + 1}.** ${url}`)
      .join("\n");
    await interaction.reply(`🎶 Current Queue:\n${queueList}`);
  },
};
