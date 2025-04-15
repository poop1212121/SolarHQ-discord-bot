const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Run a custom code or command (for bot developers only).")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code to evaluate.")
        .setRequired(true),
    ),
  async execute(interaction) {
    if (interaction.user.id !== "864612087741546527") {
      return interaction.reply({
        content: "❌ You are not authorized to use this command.",
        flags: 64, // Ephemeral
      });
    }

    const code = interaction.options.getString("code");

    try {
      const result = eval(code); // Dangerous, only for developers
      return interaction.reply({ content: `Result: ${result}` });
    } catch (error) {
      return interaction.reply({ content: `Error: ${error.message}` });
    }
  },
};
