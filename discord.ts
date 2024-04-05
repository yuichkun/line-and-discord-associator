import { Client, GatewayIntentBits } from "discord.js";

export async function sendDiscordMessage(name: string, message: string) {
  const webhookURL = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookURL) {
    throw new Error("DISCORD_WEBHOOK_URL is not set");
  }
  const options = {
    content: name + " 「" + message + "」",
  };
  const response = await fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  console.log(response);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, // For messages in guilds
    GatewayIntentBits.DirectMessages, // For direct messages
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("ready", (message) => {
  console.log("bot is ready!");
});

client.on("messageCreate", async (message) => {
  console.log("author", message.author.displayName);
  console.log("message", message.content); // Log the message content to see if it's working
});
