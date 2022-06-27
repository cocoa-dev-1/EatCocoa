import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Container } from "typedi";
import { BanManager } from "../../services/BanManager";
import { CommandCategory, CommandPermission } from "../../types/command";
import { EcCommand } from "../../types/command";
import { DiscordColor, DiscordPermission } from "../../types/discord";
import { defaultImage } from "../../utils/asset";
import { logger } from "../../utils/logger";
import { winstonLogger } from "../../utils/winston";

export const banCommand: EcCommand = {
  name: "ban",
  description: "서버에서 유저를 밴합니다.",
  category: CommandCategory.ADMIN,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("서버에서 유저를 밴합니다.")
    .setDefaultMemberPermissions(CommandPermission.ADMIN)
    .addUserOption((option) => 
      option.setName("유저")
        .setDescription("밴할 유저를 선택하세요.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: CommandInteraction, guildId: string|null) {
    if (interaction.options.getUser("유저").id === interaction.guild.ownerId) {
      return await interaction.reply("서버주인은 밴을 할 수 없습니다.");
    }
    await Container.get(BanManager).banUser(interaction);
  }
}