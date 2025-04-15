// beg.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Beg for money from other users."),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Generate a random amount to beg for (between $1 and $100)
    const begAmount = Math.floor(Math.random() * 100) + 1;

    // Simulate receiving money
    db.setBalance(userId, db.getBalance(userId) + begAmount);

    const embed = new EmbedBuilder()
      .setTitle("🙏 Begging for Money")
      .setDescription(
        `You've begged for money and received **$${begAmount.toLocaleString()}**.`,
      )
      .setColor("Purple");

    await interaction.reply({ embeds: [embed] });
  },
};
