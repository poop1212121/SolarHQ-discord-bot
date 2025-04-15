const { SlashCommandBuilder } = require("discord.js");
const QRCode = require("qrcode");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("qr")
    .setDescription("Generate a QR code from text.")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to convert to a QR code.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");
    try {
      const qrCodeData = await QRCode.toDataURL(text);

      return interaction.reply({
        embeds: [
          {
            color: 0x00ff00, // Green color
            title: "QR Code",
            image: { url: qrCodeData },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "❌ Failed to generate QR code.",
      });
    }
  },
};
