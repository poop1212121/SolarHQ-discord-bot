const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const warnsPath = path.join(__dirname, "..", "data", "warns.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removewarn")
    .setDescription("Remove a specific warning from a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to remove the warning from")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The index of the warning to remove")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const index = interaction.options.getInteger("index");

    const warns = JSON.parse(fs.readFileSync(warnsPath));

    if (!warns[user.id] || warns[user.id].length === 0) {
      return interaction.reply({
        content: `${user.tag} has no warnings.`,
        ephemeral: true,
      });
    }

    if (index < 0 || index >= warns[user.id].length) {
      return interaction.reply({
        content: "Invalid warning index.",
        ephemeral: true,
      });
    }

    const removed = warns[user.id].splice(index, 1)[0];
    if (warns[user.id].length === 0) delete warns[user.id];

    fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

    const embed = new EmbedBuilder()
      .setTitle("✅ Warning Removed")
      .setDescription(`Removed warning #${index} from ${user.tag}.`)
      .addFields(
        { name: "Reason", value: removed.reason },
        { name: "Warned By", value: removed.warnedBy || "Unknown" },
        { name: "Date", value: new Date(removed.date).toLocaleString() },
      )
      .setColor("Orange");

    await interaction.reply({ embeds: [embed] });
  },
};
