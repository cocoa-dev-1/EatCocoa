import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction } from "discord.js";
import Container from "typedi";
import { HelpManager } from "../services/helpManager";
import { CommandCategory, EcCommand } from "../types/command";
import { comunityCommands } from "./comunity";
import { musicCommands } from "./music";

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
  }
}

export const allCommands: EcCommand[] = [
  ...comunityCommands,
  ...musicCommands,
  helpCommand
]

export const commandCollection = new Collection<string, EcCommand>();

allCommands.forEach((command) => {
  commandCollection.set(command.name, command);
});