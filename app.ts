import { Hono } from "hono";
import { registerOnDiscordMessage, sendDiscordMessage } from "./discord";
import { getUserName, sendLineMessage } from "./line";

registerOnDiscordMessage(({ displayName, content }) => {
  sendLineMessage(displayName, content);
});

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

  sendDiscordMessage(userName, message);

  return c.json({
    status: "OK",
  });
});

app.get("/health", (c) => {
  console.log("/health check");
  const isDiscordWebhookUrlSet = !!process.env.DISCORD_WEBHOOK_URL;
  const isDiscordBotTokenSet = !!process.env.DISCORD_BOT_TOKEN;
  const isDiscordBotIdSet = !!process.env.DISCORD_BOT_ID;
  const isLineChannelAccessTokenSet = !!process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const isLineGroupIdSet = !!process.env.LINE_GROUP_ID;

  const isAllSet =
    isDiscordWebhookUrlSet &&
    isDiscordBotTokenSet &&
    isDiscordBotIdSet &&
    isLineChannelAccessTokenSet &&
    isLineGroupIdSet;

  const health = {
    status: isAllSet ? "OK" : "NG",
    isDiscordWebhookUrlSet,
    isDiscordBotTokenSet,
    isDiscordBotIdSet,
    isLineChannelAccessTokenSet,
    isLineGroupIdSet,
  };

  console.log(health);

  return c.json(health);
});

console.log("server is ready");

export default app;
