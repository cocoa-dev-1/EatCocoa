import { Client, Message, Role } from "discord.js";
import { EcEvent } from "../types/event";
import { logger } from "../utils/logger";

export const messageCreate: EcEvent = {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {},
};
