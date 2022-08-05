import "reflect-metadata";
import { ShardingManager } from "discord.js";
import { BOT_TOKEN } from "../config.json";

const manager = new ShardingManager("./build/src/bot.js", {
  token: BOT_TOKEN,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
