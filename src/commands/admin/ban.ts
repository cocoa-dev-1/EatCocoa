import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Container } from "typedi";
import { GuildManager } from "../../services/GuildManager";
import { CommandCategory, CommandPermission } from "../../types/command";
import { EcCommand } from "../../types/command";
import { logger } from "../../utils/logger";
import { winstonLogger } from "../../utils/winston";

export const banCommand: EcCommand = {
  name: "밴",
  description: "유저를 차단합니다.",
  category: CommandCategory.get("ADMIN").value,
  data: new SlashCommandBuilder()
    .setName("밴")
    .setDescription("서버에서 유저를 차단합니다.")
    .setDefaultMemberPermissions(CommandPermission.ADMIN)
    .addUserOption((option) =>
      option
        .setName("유저")
        .setDescription("차단할 유저를 선택하세요.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string | null) {
    await interaction.deferReply();
    const banManager = Container.get(GuildManager);
    try {
      const targetUser = banManager.getUser(interaction);
      if (targetUser.id === interaction.guild?.ownerId) {
        await banManager.Error(
          interaction,
          `<@${targetUser.id}> 님은 차단이 불가능합니다.`
        );
        return;
      }

      if (banManager.canBan(interaction, targetUser)) {
        await banManager.ban(interaction, targetUser);
      } else {
        await banManager.Error(
          interaction,
          `<@${targetUser.id}> 님은 차단이 불가능합니다.`
        );
      }
    } catch (error) {
      await banManager.Error(interaction, "알 수 없는 에러가 발생하였습니다.");
      winstonLogger.error(error);
      logger.error("ban 커맨드를 실행하던도중 에러가 발생하였습니다.");
    }
    // await Container.get(GuildManager).banUser(interaction);
  },
};
