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

async function getUserName(userId: string) {
  const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
  });
  const { displayName } = await res.json();
  return displayName;
}

import { Hono } from "hono";
const app = new Hono();
app.post("/webhook", async (c) => {
  console.log("message received");
  const reqJson = await c.req.json();
  const message = reqJson.events[0].message.text;
  const userId = reqJson.events[0].source.userId;
  const userName = await getUserName(userId);
  console.log("userId:", userId);
  console.log("userName:", userName);
  console.log("message:", message);
  return c.json({
    status: "OK",
  });
});

export default app;
