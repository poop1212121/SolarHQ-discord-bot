const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your money balance."),
  async execute(interaction) {
    const userId = interaction.user.id;
    const balance = db.getBalance(userId);

    // Check if the user is the special user and display their balance accordingly
    const displayBalance =
      userId === "864612087741546527"
        ? `♾️ (${balance.toLocaleString()})`
        : `$${balance.toLocaleString()}`;

    const embed = new EmbedBuilder()
      .setTitle("💰 Your Balance")
      .setDescription(`You have **${displayBalance}**.`)
      .setColor("Gold");

    await interaction.reply({ embeds: [embed] });
  },
};
