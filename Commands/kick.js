const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to kick.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    if (!interaction.member.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        content: "❌ You do not have permission to kick members.",
        flags: 64,
      });
    }

    const member = await interaction.guild.members.fetch(user.id);
    await member.kick("Kicked by bot command");

    const embed = new EmbedBuilder()
      .setTitle("👢 User Kicked")
      .setDescription(`Successfully kicked ${user.tag}.`)
      .setColor("Red");

    await interaction.reply({ embeds: [embed] });
  },
};
