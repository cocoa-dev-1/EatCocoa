import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";
import Container from "typedi";
import { HelpManager } from "../services/HelpManager";
import { CommandCategory, EcCommand } from "../types/command";
import { adminCommands } from "./admin";
import { mainCommands } from "./main";
import { musicCommands } from "./music";
import { playlistCommands } from "./playlist";

export const helpCommand: EcCommand = {
  name: "도움말",
  description: "코코아 봇의 사용법을 확인할 수 있습니다.",
  category: CommandCategory.get("DEFAULT").value,
  data: new SlashCommandBuilder()
    .setName("도움말")
    .setDescription("코코아 봇의 사용법을 알아보세요.")
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string) {
    await Container.get(HelpManager).createHelpMessage(interaction);
  },
};

export const allCommands: EcCommand[] = [
  ...adminCommands,
  ...musicCommands,
  ...mainCommands,
  ...playlistCommands,
  helpCommand,
];

export const commandCollection = new Collection<string, EcCommand>();

allCommands.forEach((command) => {
  commandCollection.set(command.name, command);
});
