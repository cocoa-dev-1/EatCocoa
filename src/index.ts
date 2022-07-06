import "reflect-metadata";
import { Intents } from "discord.js";
import "./utils/dotenv";
import { logger } from "./utils/logger";
import { loadCommands, commands } from "./loader/commandLoader";
import { loadEvents } from "./loader/eventLoader";
import { winstonLogger } from "./utils/winston";
import moment from "moment-timezone";
import { EatCocoa } from "./structures/Client";
import { loadManager } from "./loader/managerLoader";
moment.tz.setDefault("Asia/Seoul");
import { generateDependencyReport } from "@discordjs/voice";

export const client = new EatCocoa({
  intents: new Intents(32757),
});

client.once("ready", async () => {
  await loadCommands();
  await loadEvents(client);
  await loadManager(client);
  logger.success("봇이 성공적으로 시작되었습니다.");
  winstonLogger.info("Bot started successfully");
  // logger.log(generateDependencyReport());
});

client.login(process.env.BOT_TOKEN);
