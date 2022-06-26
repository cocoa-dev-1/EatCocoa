import { Client } from "discord.js";
import { EcEvent } from "../types/event";
import { logger } from "../utils/logger";

export const interactionCreate: EcEvent = {
  name: "interactionCreate",
  once: false,
  async execute(client: Client) {
    logger.log("interactionCreate");
  }
}