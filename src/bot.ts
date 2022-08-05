import "reflect-metadata";
import { GatewayIntentBits, IntentsBitField, Partials } from "discord.js";
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
import { loadManager } from "./loader/managerLoader";

export const client = new EatCocoa({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
});

client.once("ready", async () => {
  await loadTypeorm();
  await loadCommands();
  await loadEvents(client);
  await loadManager();
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

process.on("unhandledRejection", (error) => console.log(error));
process.on("uncaughtException", (error) => console.log(error));

client.login(BOT_TOKEN);
