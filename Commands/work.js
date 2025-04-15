const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work and earn money!"),
  async execute(interaction) {
    const amount = Math.floor(Math.random() * 200) + 100;
    db.addBalance(interaction.user.id, amount); // Add earned money

    const embed = new EmbedBuilder()
      .setTitle("🛠️ You worked!")
      .setDescription(`You earned **$${amount}**.`)
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  },
};
