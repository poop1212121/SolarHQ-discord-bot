const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setmoney")
    .setDescription("Set a user's money (Admins only).")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to set money for")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription(
          'Amount of money to set (number or "infinite", "♾️", "∞")',
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const hasRole = interaction.member.roles.cache.some(
      (role) => role.name === "Admin",
    );

    if (!hasRole) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        flags: 64,
      });
    }

    const target = interaction.options.getUser("user");
    const rawAmount = interaction.options
      .getString("amount")
      .trim()
      .toLowerCase();

    const infiniteValues = ["infinite", "inf", "♾️", "∞"];
    let finalAmount;
    let displayAmount;

    if (infiniteValues.includes(rawAmount)) {
      finalAmount = Number.MAX_SAFE_INTEGER; // or use a custom flag system if needed
      displayAmount = "♾️ Infinite";
    } else if (/^\d+$/.test(rawAmount)) {
      finalAmount = parseInt(rawAmount, 10);
      displayAmount = `$${finalAmount.toLocaleString()}`;
    } else {
      return interaction.reply({
        content: "❌ Please enter a valid number or one of: infinite, ♾️, ∞.",
        flags: 64,
      });
    }

    db.setBalance(target.id, finalAmount);

    const embed = new EmbedBuilder()
      .setTitle("💼 Money Updated")
      .setDescription(`Set <@${target.id}>'s balance to **${displayAmount}**.`)
      .setColor("Orange");

    await interaction.reply({ embeds: [embed] });
  },
};
