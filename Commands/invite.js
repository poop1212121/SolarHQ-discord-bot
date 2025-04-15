const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot's invite link."),

  async execute(interaction) {
    const inviteLink =
      "https://discord.com/oauth2/authorize?client_id=1360963434060976158&permissions=8&integration_type=0&scope=bot";

    await interaction.reply({
      embeds: [
        {
          color: 0x5865f2, // Discord blurple
          title: "🔗 Invite This Bot",
          description: `[Click here to invite the bot](${inviteLink})`,
          footer: {
            text: "Thanks for adding the bot!",
          },
        },
      ],
      ephemeral: true, // Only visible to the user
    });
  },
};
