import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandCategory, EcCommand } from "../../types/command";

export const testCommand: EcCommand = {
  name: "테스트",
  description: "테스트 커맨드",
  category: CommandCategory.get("DEFAULT").value,
  data: new SlashCommandBuilder()
    .setName("테스트")
    .setDescription("테스트 커맨드 입니다.")
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string) {
    await interaction.reply("테스트 하는중...");
  },
};
