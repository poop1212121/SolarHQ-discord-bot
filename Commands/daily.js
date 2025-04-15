const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

const cooldown = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward!"),
  async execute(interaction) {
    const userId = interaction.user.id;

    const lastUsed = cooldown.get(userId);
    const now = Date.now();
    const cooldownTime = 24 * 60 * 60 * 1000;

    if (lastUsed && now - lastUsed < cooldownTime) {
      const remaining = Math.ceil(
        (cooldownTime - (now - lastUsed)) / 1000 / 60 / 60,
      );
      return interaction.reply({
        content: `⏳ You already claimed your daily! Come back in ${remaining}h.`,
        ephemeral: true,
      });
    }

    const amount = 500;
    db.addBalance(userId, amount); // Add money to user's balance
    cooldown.set(userId, now);

    const embed = new EmbedBuilder()
      .setTitle("🗓️ Daily Claimed!")
      .setDescription(`You received **$${amount}**.`)
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  },
};
