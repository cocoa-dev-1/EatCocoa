import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandCategory, EcCommand } from "../../types/command";

export const kickCommand: EcCommand = {
  name: "추방",
  description: "유저를 추방합니다.",
  category: CommandCategory.get("ADMIN").value,
  data: new SlashCommandBuilder()
    .setName("추방")
    .setDescription("유저를 추방합니다.")
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("추방할 유저를 선택하세요.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("사유").setDescription("사유를 입력하세요.")
    )
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string) {
    const member = interaction.options.getMember("유저");
    const reason = interaction.options.getString("사유") || "사유 없음";
  },
};
