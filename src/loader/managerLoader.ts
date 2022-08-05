import { Manager } from "erela.js";
import { allLavaLinkEvents } from "../events/lavalink";
import { client } from "../bot";
import { logger } from "../utils/logger";
import { nodes } from "../../config.json";

export const manager = new Manager({
  nodes: nodes,
  autoPlay: true,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

export const loadManager = async () => {
  manager.init(client.user.id);
  logger.log("Started loading lavalink events");
  try {
    allLavaLinkEvents.forEach((event) => {
      if (event.once) {
        manager.once(event.name, event.execute);
      } else {
        manager.on(event.name as any, event.execute);
      }
    });
    logger.success("Successfully loaded lavalink events");
  } catch (e) {
    logger.error("Error while loading lavalink events");
  }
};
