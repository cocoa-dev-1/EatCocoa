import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { allCommands } from "../commands";
import { logger } from "./logger";

export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  ...allCommands.map(command => command.data)
];

export const loadCommands = async () => {
  if (process.env.BOT_TOKEN === undefined) {
		logger.error("BOT_TOKEN is not defined.");
		logger.error("Failed to reload application (/) commands.");
		return;
	}
	const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
	try {
		logger.log('Started refreshing application (/) commands.');

    if (process.env.CLIENT_ID === undefined) {
			logger.error("CLIENT_ID is not defined.");
			logger.error("Failed to reload application (/) commands.");
			return;
		}
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);
		
		logger.success('Successfully reloaded application (/) commands.');
	} catch (error) {
		logger.error("Failed to reload application (/) commands.");
	}
}