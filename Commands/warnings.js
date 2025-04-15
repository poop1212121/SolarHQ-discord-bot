// warnings.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Check the warnings of a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check warnings for")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    // Load warns.json safely
    const warnsPath = path.join(__dirname, "../data/warns.json");
    let warns = {};
    try {
      const data = fs.readFileSync(warnsPath, "utf-8");
      warns = data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn("Could not load warns.json, starting empty.");
      warns = {};
    }

    const userWarnings = warns[user.id];

    if (!userWarnings || userWarnings.length === 0) {
      return interaction.reply({
        content: `${user.tag} has no warnings.`,
        flags: 64, // ephemeral
      });
    }

    // Format the warnings nicely
    const formatted = userWarnings
      .map((w, i) => `**#${i}** - ${w.reason} (by <@${w.moderator}>)`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Warnings`)
      .setDescription(formatted)
      .setColor("Yellow");

    await interaction.reply({ embeds: [embed] });
  },
};
