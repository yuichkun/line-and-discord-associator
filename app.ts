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

export default app;
