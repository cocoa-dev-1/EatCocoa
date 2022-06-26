import { Client } from "discord.js";
import { allEvents } from "../events";
import { logger } from "./logger";

export const loadEvents = (client: Client) => {
  logger.log("Started loading events");
  try{
    allEvents.forEach((event) => {
        if (event.once) {
          client.once(event.name, event.execute);
        } else {
          client.on(event.name, event.execute);
        }
      }
    );
    logger.success("Successfully loaded events");
  } catch(e) {
    logger.error("Error while loading events");
  }
}