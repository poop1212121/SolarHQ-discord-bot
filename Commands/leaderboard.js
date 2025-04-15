const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 players with the highest balances."),

  async execute(interaction) {
    const data = db.getAllBalances(); // Assumes getAllBalances() returns { userId: { balance: number } }

    const sortedData = Object.entries(data)
      .map(([userId, userData]) => ({
        userId,
        balance: userData.balance,
      }))
      .sort((a, b) => b.balance - a.balance);

    const pageSize = 10;
    const totalPages = Math.ceil(sortedData.length / pageSize);
    let page = 1;

    const createEmbed = async (pageNum) => {
      const start = (pageNum - 1) * pageSize;
      const end = pageNum * pageSize;
      const pageData = sortedData.slice(start, end);

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard - Top Players")
        .setColor("Gold")
        .setFooter({ text: `Page ${pageNum} of ${totalPages}` })
        .setTimestamp();

      let description = "";
      for (let i = 0; i < pageData.length; i++) {
        const { userId, balance } = pageData[i];
        let user;
        try {
          user = await interaction.client.users.fetch(userId);
        } catch {
          user = { username: "Unknown User" };
        }

        const displayBalance =
          userId === "864612087741546527"
            ? "∞"
            : `$${balance.toLocaleString()}`;

        description += `**#${start + i + 1}** — \`${user.username}\`\n💰 ${displayBalance}\n\n`;
      }

      embed.setDescription(description || "No data available.");
      return embed;
    };

    const embed = await createEmbed(page);
    await interaction.reply({ embeds: [embed] });
    const replyMessage = await interaction.fetchReply();

    if (totalPages <= 1) return;

    await replyMessage.react("⬅️");
    await replyMessage.react("➡️");

    const filter = (reaction, user) =>
      ["⬅️", "➡️"].includes(reaction.emoji.name) && !user.bot;

    const collector = replyMessage.createReactionCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (reaction, user) => {
      if (reaction.emoji.name === "➡️" && page < totalPages) {
        page++;
      } else if (reaction.emoji.name === "⬅️" && page > 1) {
        page--;
      }

      const newEmbed = await createEmbed(page);
      await interaction.editReply({ embeds: [newEmbed] });
      await reaction.users.remove(user.id); // Clean up reaction
    });

    collector.on("end", () => {
      replyMessage.reactions.removeAll().catch(() => {});
    });
  },
};
