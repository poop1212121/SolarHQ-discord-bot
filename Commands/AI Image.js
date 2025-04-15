const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aiimage")
    .setDescription("Generate an AI image based on your prompt.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Provide a prompt for the image")
        .setRequired(true),
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");

    try {
      // Correct endpoint for image generation using OpenAI's DALL·E
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: prompt,
          n: 1, // Number of images you want to generate
          size: "1024x1024", // Image size
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      const imageUrl = response.data.data[0].url;

      const embed = new EmbedBuilder()
        .setTitle("AI Generated Image")
        .setImage(imageUrl)
        .setColor("PURPLE");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ There was an error generating the image.",
        ephemeral: true,
      });
    }
  },
};
