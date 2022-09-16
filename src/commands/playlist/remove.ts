import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandCategory, EcCommand } from "../../types/command";

export const plremoveCommand: EcCommand = {
  name: "제거",
  description: "플레이 리스트에서 특정 노래를 제거합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("제거")
    .setDescription("플레이 리스트에서 특정 노래를 제거합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트 이름")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("제거하고자 하는 노래의 위치")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {},
};
