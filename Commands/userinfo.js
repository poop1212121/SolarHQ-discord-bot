const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to get info about.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}'s Info`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Username", value: user.username, inline: true },
        {
          name: "Joined Server",
          value: member.joinedAt.toDateString(),
          inline: true,
        },
        { name: "ID", value: user.id, inline: true },
        {
          name: "Account Created",
          value: user.createdAt.toDateString(),
          inline: true,
        },
      )
      .setColor("Purple");

    await interaction.reply({ embeds: [embed] });
  },
};
