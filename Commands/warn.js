const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const warnsPath = path.join(__dirname, "..", "data", "warns.json");

// Ensure the data folder and file exist
if (!fs.existsSync(path.dirname(warnsPath))) {
  fs.mkdirSync(path.dirname(warnsPath));
}
if (!fs.existsSync(warnsPath)) {
  fs.writeFileSync(warnsPath, "{}");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user for a reason.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to warn")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the warning")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    // Load existing warnings
    const warns = JSON.parse(fs.readFileSync(warnsPath));

    if (!warns[user.id]) warns[user.id] = [];

    warns[user.id].push({
      reason: reason,
      date: new Date().toISOString(),
      warnedBy: interaction.user.tag,
    });

    fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

    // Log the warning in the "logs" channel
    const logChannel = interaction.guild.channels.cache.find(
      (c) => c.name === "logs",
    );
    const logEmbed = new EmbedBuilder()
      .setTitle("🔔 User Warned")
      .setDescription(`${user.tag} has been warned for: ${reason}`)
      .addFields(
        { name: "Warned By", value: interaction.user.tag, inline: true },
        { name: "Reason", value: reason, inline: true },
        { name: "Date", value: new Date().toLocaleString(), inline: true },
      )
      .setColor("Red");

    if (logChannel) await logChannel.send({ embeds: [logEmbed] });

    // Respond to the command
    const replyEmbed = new EmbedBuilder()
      .setTitle("✅ User Warned")
      .setDescription(`${user.tag} has been warned.`)
      .setColor("Green");

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
