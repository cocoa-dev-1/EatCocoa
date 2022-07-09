import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const createCommand: EcCommand = {
  name: "생성",
  description: "플레이 리스트를 생성합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("생성")
    .setDescription("플레이 리스트를 생성합니다.")
    .addStringOption((option) =>
      option
        .setName("이름")
        .setDescription("리스트 이름을 지정합니다.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
  },
};
