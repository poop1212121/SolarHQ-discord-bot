const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("countdown")
    .setDescription("Show countdown until a specific time.")
    .addIntegerOption((option) =>
      option.setName("hour").setDescription("Hour (0-23)").setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("minute")
        .setDescription("Minute (0-59)")
        .setRequired(true),
    ),
  async execute(interaction) {
    const hour = interaction.options.getInteger("hour");
    const minute = interaction.options.getInteger("minute");

    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
    );

    // If target time already passed today, set for tomorrow
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }

    const unixTime = Math.floor(target.getTime() / 1000);
    await interaction.reply(`⏰ Countdown ends <t:${unixTime}:R>`);
  },
};
