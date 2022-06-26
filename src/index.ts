import { Client, Intents } from "discord.js";
import "./utils/dotenv"
import { logger } from "./utils/logger";
import { loadCommands } from "./utils/commandLoader";
import { loadEvents } from "./utils/eventLoader";

const client = new Client({
  intents: new Intents(32757)
});

client.once("ready", async () => {
  await loadCommands();
  loadEvents(client);
  logger.success("봇이 성공적으로 시작되었습니다.");
});

client.login(process.env.BOT_TOKEN);