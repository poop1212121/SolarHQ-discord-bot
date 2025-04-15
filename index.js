require("dotenv").config();
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const SpotifyWebApi = require("spotify-web-api-node");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Map();
client.warnings = new Map();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Request an access token using the client credentials flow
async function authenticateSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const accessToken = data.body["access_token"];
    spotifyApi.setAccessToken(accessToken);
    console.log("Spotify access token acquired successfully.");
    console.log("Access Token: ", accessToken); // Log the access token
  } catch (error) {
    console.error("Error while authenticating Spotify:", error);
  }
}

// Load commands from files
const commandFiles = fs
  .readdirSync(path.join(__dirname, "Commands"))
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const command = require(path.join(__dirname, "Commands", file));

  if (command.data && command.execute) {
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }
}

// Register commands with Discord
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}!`);

  // Set bot presence to "Playing solarhq.vercel.app ┃ /help"
  client.user.setPresence({
    activities: [
      {
        name: "/help",
        type: 0, // Playing
      },
    ],
    status: "online",
  });

  await authenticateSpotify();
});

// Handle interactionCreate event
client.on("interactionCreate", async (interaction) => {
  // Slash Command handling
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction); // Execute the command if found
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ There was an error while executing that command!",
          ephemeral: true,
        });
      }
    }
  }

  // Modal Submit handling
  if (interaction.isModalSubmit()) {
    if (interaction.customId === "createGiveawayModal") {
      try {
        // Get input values from the modal fields
        const prize = interaction.fields.getTextInputValue("giveawayPrize");
        const winners = parseInt(
          interaction.fields.getTextInputValue("giveawayWinners"),
        );
        const durationRaw =
          interaction.fields.getTextInputValue("giveawayDuration");
        const duration = require("ms")(durationRaw); // Convert duration string to milliseconds

        // Check for invalid input values
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

        // Calculate the end time for the giveaway
        const endTimestamp = Date.now() + duration;
        const endTime = `<t:${Math.floor(endTimestamp / 1000)}:R>`;

        // Reply to the interaction with the giveaway details
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
});

// Login the bot
client.login(process.env.TOKEN);
