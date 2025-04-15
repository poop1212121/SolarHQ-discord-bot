const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server.")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ban").setRequired(true),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: "You do not have permission to ban members!",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    try {
      await interaction.guild.members.ban(user);
      await interaction.reply(`${user.tag} has been banned!`);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error trying to ban this user.",
        ephemeral: true,
      });
    }
  },
};
