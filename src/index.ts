import "reflect-metadata";
import { GatewayIntentBits, Partials } from "discord.js";
// import "./utils/dotenv";
import { logger } from "./utils/logger";
import { loadCommands, commands } from "./loader/commandLoader";
import { loadEvents } from "./loader/eventLoader";
import { winstonLogger } from "./utils/winston";
import moment from "moment-timezone";
import { EatCocoa } from "./structures/Client";
moment.tz.setDefault("Asia/Seoul");
import { generateDependencyReport } from "@discordjs/voice";
import { BOT_TOKEN } from "../config.json";
import { loadTypeorm, ECDataSource } from "./loader/typeormLoader";
import { ActivityType } from "discord-api-types/v10";
import { Manager } from "./structures/Manager";

export const client = new EatCocoa({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

export const music = new Manager();

client.once("ready", async () => {
  await loadTypeorm();
  await loadCommands();
  await loadEvents(client);
  logger.success("봇이 성공적으로 시작되었습니다.");
  winstonLogger.info("Bot started successfully");
  // logger.log(generateDependencyReport());
  // ECDataSource.runMigrations({
  //   transaction: "all",
  // });
  setInterval(() => {
    const servers = client.guilds.cache
      .map((guild) => guild.id)
      .length.toLocaleString();
    client.user.setActivity(`/도움말 | ${servers} 개의 서버`, {
      type: ActivityType.Playing,
    });
  }, 10000);
});

client.login(BOT_TOKEN);
