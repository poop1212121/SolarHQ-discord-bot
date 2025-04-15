const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get information about the server."),
  async execute(interaction) {
    const guild = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name}'s Info`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Server Name", value: guild.name, inline: true },
        { name: "Total Members", value: `${guild.memberCount}`, inline: true },
        {
          name: "Created At",
          value: guild.createdAt.toDateString(),
          inline: true,
        },
        { name: "Region", value: guild.preferredLocale, inline: true },
      )
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  },
};
