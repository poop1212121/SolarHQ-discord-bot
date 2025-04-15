const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const db = require("../utils/economy");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register a user or everyone to start with $500.")
    .addStringOption((option) =>
      option
        .setName("user")
        .setDescription('Mention a user or type "all" to register everyone.')
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild), // Only mods/admins can use on others

  async execute(interaction) {
    const input = interaction.options.getString("user");

    // Handle "all"
    if (input?.toLowerCase() === "all") {
      const members = await interaction.guild.members.fetch();
      let registeredCount = 0;

      members.forEach((member) => {
        if (!member.user.bot) {
          const userId = member.user.id;
          if (db.getBalance(userId) === undefined) {
            db.setBalance(userId, 500);
            registeredCount++;
          }
        }
      });

      return interaction.reply({
        content: `✅ Registered ${registeredCount} members with $500.`,
        ephemeral: false,
      });
    }

    // Handle user mention or default to executor
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const userId = targetUser.id;
    const currentBalance = db.getBalance(userId);

    if (currentBalance !== undefined) {
      return interaction.reply({
        content: `❌ ${targetUser.tag} is already registered!`,
        ephemeral: true,
      });
    }

    db.setBalance(userId, 500);

    const embed = new EmbedBuilder()
      .setTitle("✅ Registered")
      .setDescription(
        `${targetUser.tag} has been registered and received **$500**!`,
      )
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  },
};
