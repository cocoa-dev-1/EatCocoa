import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { Collection, CommandInteraction } from "discord.js";
import { EatCocoa } from "../structures/Client";

export interface EcCommand {
  name: string;
  description: string;
  category: string;
  data: RESTPostAPIApplicationCommandsJSONBody;
  execute(interaction: CommandInteraction, guildId: string | null): void;
}

export interface EcCommandCategory {
  name: string;
  value: string;
  description: string;
}

export const CommandCategoryList: EcCommandCategory[] = [
  {
    name: "DEFAULT",
    value: "기본 명령어",
    description: "기본 명령어를 확인합니다.",
  },
  {
    name: "ADMIN",
    value: "관리자 명령어",
    description: "관리자 명령어를 확인합니다.",
  },
  {
    name: "MUSIC",
    value: "음악 명령어",
    description: "음악 명령어를 확인합니다.",
  },
  {
    name: "PLAYLIST",
    value: "플레이 리스트 명령어",
    description: "플레이 리스트 명령어를 확인합니다.",
  },
];

export const CommandCategory = new Map<string, EcCommandCategory>();
CommandCategoryList.forEach((element) =>
  CommandCategory.set(element.name, element)
);

export enum CommandPermission {
  BAN_MEMBERS = 2,
  ADMIN = 3,
}
