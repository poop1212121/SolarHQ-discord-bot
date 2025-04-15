const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a user's profile picture and banner.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to view the profile of."),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const userBanner =
      user.bannerURL({ size: 1024, dynamic: true }) || "No banner found";
    const userAvatar = user.displayAvatarURL({ size: 1024, dynamic: true });

    return interaction.reply({
      embeds: [
        {
          color: 0x00ff00, // Green color
          title: `${user.username}'s Profile`,
          fields: [
            {
              name: "Avatar",
              value: `[Click here to view](${userAvatar})`,
            },
            {
              name: "Banner",
              value: `[Click here to view](${userBanner})`,
            },
          ],
        },
      ],
    });
  },
};
