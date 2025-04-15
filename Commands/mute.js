const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user for a certain amount of time.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to mute.")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes to mute the user.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const duration = interaction.options.getInteger("duration");

    if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
      return interaction.reply({
        content: "❌ You do not have permission to mute members.",
        flags: 64,
      });
    }

    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(duration * 60 * 1000);

    const embed = new EmbedBuilder()
      .setTitle("🔇 User Muted")
      .setDescription(`Muted ${user.tag} for ${duration} minutes.`)
      .setColor("Red");

    await interaction.reply({ embeds: [embed] });
  },
};
