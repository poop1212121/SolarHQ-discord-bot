const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available commands."),

  async execute(interaction) {
    // Deferring the interaction to avoid the "InteractionAlreadyReplied" error
    await interaction.deferReply();

    const commands = interaction.client.commands;
    let commandList = "";
    let commandCount = 0;
    let pageNumber = 1;

    // Iterate through commands and prepare them in chunks.
    for (const [name, command] of commands) {
      commandList += `\`/${name}\`: ${command.data.description}\n`;
      commandCount++;

      // If the number of commands exceeds a safe limit, split them into multiple embeds.
      if (commandCount >= 20) {
        // Adjust based on your embed size and Discord's limits
        await interaction.followUp({
          embeds: [
            {
              color: 0x00ff00, // Example green color
              title: `Available Commands (Page ${pageNumber})`,
              description: commandList,
            },
          ],
        });

        // Reset and prepare for the next page of commands
        commandList = "";
        commandCount = 0;
        pageNumber++;
      }
    }

    // If there are remaining commands that didn't get sent, send them in the last embed.
    if (commandList !== "") {
      await interaction.followUp({
        embeds: [
          {
            color: 0x00ff00, // Example green color
            title: `Available Commands (Page ${pageNumber})`,
            description: commandList,
          },
        ],
      });
    }
  },
};
