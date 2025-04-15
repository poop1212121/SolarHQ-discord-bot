const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to get the avatar of."),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatarUrl = user.displayAvatarURL({ size: 1024, dynamic: true });

    return interaction.reply({
      embeds: [
        {
          color: 0x00ff00, // Green color
          title: `${user.username}'s Avatar`,
          image: { url: avatarUrl },
        },
      ],
    });
  },
};
