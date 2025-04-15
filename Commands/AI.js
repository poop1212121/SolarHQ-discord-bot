const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("Ask the AI anything!")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Ask your question")
        .setRequired(true),
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question");

    try {
      // Correct API endpoint for the chat model (e.g., GPT-3.5 or GPT-4)
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // Use the appropriate model
          messages: [{ role: "user", content: question }],
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      const aiAnswer = response.data.choices[0].message.content.trim();

      const embed = new EmbedBuilder()
        .setTitle("AI Response")
        .setDescription(aiAnswer)
        .setColor("BLUE");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ There was an error with the AI request.",
        ephemeral: true,
      });
    }
  },
};
