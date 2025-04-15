const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Gamble your money.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to gamble")
        .setRequired(true),
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const userId = interaction.user.id;
    const balance = db.getBalance(userId);

    if (amount > balance) {
      return await interaction.reply({
        content: "❌ You don't have enough money.",
        ephemeral: true,
      });
    }

    const win = Math.random() < 0.5;
    const result = win ? amount : -amount;
    db.addBalance(userId, result); // Update the balance after gambling

    const embed = new EmbedBuilder()
      .setTitle("🎰 Gambling Result")
      .setDescription(
        win ? `You **won** $${amount}!` : `You **lost** $${amount}.`,
      )
      .setColor(win ? "Green" : "Red");

    await interaction.reply({ embeds: [embed] });
  },
};
