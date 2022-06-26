import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface EcCommand {
  name: string,
  description: string,
  category: string,
  data: SlashCommandBuilder,
  execute(interaction: CommandInteraction): void;
}