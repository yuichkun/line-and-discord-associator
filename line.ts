export async function sendLineMessage(name: string, text: string) {
  const webhookURL = "https://api.line.me/v2/bot/message/push";

  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  }

  const response = await fetch(webhookURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: process.env.LINE_GROUP_ID,
      messages: [
        {
          type: "text",
          text: `${name} 「${text}」`,
        },
      ],
    }),
  });
  console.log(response);
}

export async function getUserName(userId: string) {
  const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
  });
  const { displayName } = await res.json();
  return displayName;
}
