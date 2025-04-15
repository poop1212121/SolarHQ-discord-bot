const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Give money to another user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give money to")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to give")
        .setRequired(true),
    ),
  async execute(interaction) {
    const senderId = interaction.user.id;
    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    if (senderId === target.id)
      return interaction.reply({
        content: "❌ You can't give money to yourself.",
        ephemeral: true,
      });

    if (amount <= 0)
      return interaction.reply({
        content: "❌ Invalid amount.",
        ephemeral: true,
      });

    if (db.getBalance(senderId) < amount)
      return interaction.reply({
        content: "❌ You don't have enough money.",
        ephemeral: true,
      });

    db.addBalance(senderId, -amount); // Deduct from sender
    db.addBalance(target.id, amount); // Add to receiver

    const embed = new EmbedBuilder()
      .setTitle("💸 Transfer Complete")
      .setDescription(
        `<@${interaction.user.id}> gave <@${target.id}> **$${amount}**.`,
      )
      .setColor("Purple");

    await interaction.reply({ embeds: [embed] });
  },
};
