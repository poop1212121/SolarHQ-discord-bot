const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create a new giveaway"),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("createGiveawayModal")
      .setTitle("Create a Giveaway");

    const prizeInput = new TextInputBuilder()
      .setCustomId("giveawayPrize")
      .setLabel("🎁 Prize")
      .setPlaceholder("What are you giving away?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const winnersInput = new TextInputBuilder()
      .setCustomId("giveawayWinners")
      .setLabel("👥 Number of Winners")
      .setPlaceholder("e.g. 1")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const durationInput = new TextInputBuilder()
      .setCustomId("giveawayDuration")
      .setLabel("⏳ Duration (e.g. 10m, 1h, 2d)")
      .setPlaceholder("How long should the giveaway last?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row1 = new ActionRowBuilder().addComponents(prizeInput);
    const row2 = new ActionRowBuilder().addComponents(winnersInput);
    const row3 = new ActionRowBuilder().addComponents(durationInput);

    modal.addComponents(row1, row2, row3);

    await interaction.showModal(modal);
  },
};
