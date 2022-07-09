import { REST } from "@discordjs/rest";
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v10";
import { allCommands } from "../commands";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";
import { BOT_TOKEN, CLIENT_ID } from "../../config.json";

export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  ...allCommands.map((command) => command.data),
];

export const loadCommands = async () => {
  if (BOT_TOKEN === undefined) {
    logger.error("BOT_TOKEN is not defined.");
    logger.error("Failed to reload application (/) commands.");
    return;
  }
  const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);
  try {
    logger.log("Started refreshing application (/) commands.");

    if (CLIENT_ID === undefined) {
      logger.error("CLIENT_ID is not defined.");
      logger.error("Failed to reload application (/) commands.");
      return;
    }
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    logger.success("Successfully reloaded application (/) commands.");
  } catch (error) {
    winstonLogger.error(error);
    logger.error("Failed to reload application (/) commands.");
  }
};
