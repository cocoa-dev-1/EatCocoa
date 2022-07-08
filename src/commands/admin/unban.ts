import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Container from "typedi";
import { GuildManager } from "../../services/GuildManager";
import {
  CommandCategory,
  CommandPermission,
  EcCommand,
} from "../../types/command";
import { logger } from "../../utils/logger";
import { winstonLogger } from "../../utils/winston";

export const unbanCommand: EcCommand = {
  name: "언밴",
  description: "유저를 차단해제 합니다.",
  category: CommandCategory.get("ADMIN").value,
  data: new SlashCommandBuilder()
    .setName("언밴")
    .setDescription("서버에서 유저를 차단 해제합니다.")
    .setDefaultMemberPermissions(CommandPermission.ADMIN)
    .addStringOption((option) =>
      option
        .setName("유저")
        .setDescription("차단해제할 유저의 Id를 입력하세요.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string | null) {
    await interaction.deferReply();
    const banManager = Container.get(GuildManager);

    try {
      const targetUser = banManager.getBanUser(interaction);
      if (banManager.canUnban(interaction, targetUser)) {
        await banManager.unban(interaction, targetUser);
      } else {
        await banManager.Error(
          interaction,
          `<@${targetUser}> 님은 차단되어있지 않습니다.`
        );
      }
    } catch (error) {
      await banManager.Error(interaction, "알 수 없는 에러가 발생하였습니다.");

      winstonLogger.error(error);
      logger.error("unban 커맨드를 실행하던도중 에러가 발생하였습니다.");
    }
  },
};
