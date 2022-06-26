import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { EcCommand } from "../../types/command";
import { logger } from "../../utils/logger";

export const banCommand: EcCommand = {
  name: "ban",
  description: "Bans a user from the server.",
  category: "comunity",
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server.")
  ,
  execute(interaction: CommandInteraction, guildId: string) {
    interaction.reply("테스트");
  }
}