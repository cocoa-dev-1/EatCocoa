import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { CommandInteraction } from "discord.js";

export interface EcCommand {
  name: string,
  description: string,
  category: string,
  data: RESTPostAPIApplicationCommandsJSONBody,
  execute(interaction: CommandInteraction, guildId: string|null): void;
}

export enum CommandCategory {
  ADMIN = "ADMIN",
}

export enum CommandPermission {
  BAN_MEMBERS = 2,
  ADMIN = 3
}