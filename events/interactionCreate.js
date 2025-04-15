const ms = require("ms");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // Slash Command
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: "Error running this command!",
          ephemeral: true,
        });
      }
    }

    // Modal Submit
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "createGiveawayModal") {
        try {
          const prize = interaction.fields.getTextInputValue("giveawayPrize");
          const winners = parseInt(
            interaction.fields.getTextInputValue("giveawayWinners"),
          );
          const durationRaw =
            interaction.fields.getTextInputValue("giveawayDuration");
          const duration = ms(durationRaw);

          if (isNaN(winners) || winners <= 0)
            return await interaction.reply({
              content: "Invalid number of winners.",
              ephemeral: true,
            });

          if (!duration)
            return await interaction.reply({
              content: "Invalid duration format.",
              ephemeral: true,
            });

          const endTimestamp = Date.now() + duration;
          const endTime = `<t:${Math.floor(endTimestamp / 1000)}:R>`;

          await interaction.reply({
            embeds: [
              {
                title: "🎉 Giveaway Started!",
                description: `**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** ${endTime}`,
                color: 0x9b59b6,
              },
            ],
          });
        } catch (err) {
          console.error(err);
          await interaction.reply({
            content: "There was an error processing your giveaway.",
            ephemeral: true,
          });
        }
      }
    }
  },
};
