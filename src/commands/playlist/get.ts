import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Container from "typedi";
import { PlayListManager } from "../../services/PlayListManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const getCommand: EcCommand = {
  name: "리스트검색",
  description: "플레이 리스트를 찾습니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("리스트검색")
    .setDescription("플레이 리스트를 검색합니다.")
    .addStringOption((option) =>
      option
        .setName("이름")
        .setDescription("플레이 리스트 이름")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const playListManager = Container.get(PlayListManager);
    const playListName = interaction.options.getString("이름");
  },
};
