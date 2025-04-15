const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified number of messages from the channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to delete (max 100).")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100),
    ), // Limit to 100 messages (Discord API limit)
  async execute(interaction) {
    // Get the amount of messages to delete
    const amount = interaction.options.getInteger("amount");

    // Check if the user has permission to manage messages (Admin/Moderator)
    if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
      return interaction.reply({
        content: "❌ You do not have permission to manage messages.",
        flags: 64, // Make the message ephemeral (only visible to the user)
      });
    }

    try {
      // Fetch the messages in the channel
      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });

      // Filter out any messages older than 14 days (Discord API limit)
      const recentMessages = messages.filter(
        (msg) => Date.now() - msg.createdTimestamp < 1209600000,
      );

      // If there are no messages that are less than 14 days old, return a message
      if (recentMessages.size === 0) {
        await interaction.reply({
          content: "❌ There are no messages under 14 days old to delete.",
          flags: 64, // Make the message ephemeral (only visible to the user)
        });
        return;
      }

      // Perform the bulk delete for valid messages
      await interaction.channel.bulkDelete(recentMessages);

      // If the number of messages deleted is less than the requested amount
      if (recentMessages.size < amount) {
        await interaction.reply({
          content: `I deleted **${recentMessages.size}** messages (some may have been too old to delete).`,
          flags: 64,
        });
      } else {
        // Send a successful confirmation message
        const embed = new EmbedBuilder()
          .setTitle("🧹 Messages Cleared")
          .setDescription(
            `Successfully cleared **${recentMessages.size}** messages.`,
          )
          .setColor("Green");

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ An error occurred while trying to delete messages.",
        flags: 64, // Make the message ephemeral (only visible to the user)
      });
    }
  },
};
