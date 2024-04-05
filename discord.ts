export async function sendDiscordMessage(name: string, message: string) {
  const webhookURL = process.env.DISCORD_WEBHOOK_URL
  if (!webhookURL) { 
    throw new Error("DISCORD_WEBHOOK_URL is not set")
  }
  const options = {
    "content" : name+" 「"+message+"」"
  };
  const response = await fetch(
    webhookURL,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    }
  );
  console.log(response)
}