import {
  CommandInteraction,
  GuildMember,
  MessageEmbed,
  User,
} from "discord.js";
import { Service } from "typedi";
import { DiscordColor, DiscordPermission } from "../types/discord";
import { defaultImage } from "../utils/asset";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

@Service()
export class GuildManager {
  constructor() {}

  async ban(interaction: CommandInteraction, targetUser: User) {
    await interaction.guild.members.ban(targetUser);
    await this.banSuccess(interaction, targetUser);
  }

  async unban(interaction: CommandInteraction, targetUserId: string) {
    try {
      const targetUser = await interaction.guild.members.unban(targetUserId);
      await this.unbanSuccess(interaction, targetUser);
    } catch (error) {
      this.Error(
        interaction,
        `<@${targetUserId}> 님은 차단해제할 수 없습니다.`
      );
    }
  }

  getUser(interaction: CommandInteraction): User | undefined {
    return interaction.options.getUser("유저");
  }

  getBanUser(interaction: CommandInteraction): string | undefined {
    return interaction.options.getString("유저");
  }

  async isBanned(
    interaction: CommandInteraction,
    targetUserId: string
  ): Promise<User | undefined> {
    const targetUserCash = await interaction.guild.bans.fetch();
    const isBanned = targetUserCash.find(
      (user) => user.user.id === targetUserId
    );
    return isBanned?.user;
  }

  canBan(interaction: CommandInteraction, targetUser: User): boolean {
    const targetUserCash = interaction.guild.members.cache.get(targetUser.id);
    const userCash = interaction.guild.members.cache.get(interaction.user.id);
    if (
      targetUserCash.roles.highest.comparePositionTo(userCash.roles.highest) >=
        0 &&
      !targetUserCash.permissions.has(DiscordPermission.ADMIN)
    ) {
      return true;
    }
    return false;
  }

  async canUnban(
    interaction: CommandInteraction,
    targetUserId: string
  ): Promise<boolean> {
    try {
      const isBanned = await this.isBanned(interaction, targetUserId);
      if (isBanned) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async banSuccess(
    interaction: CommandInteraction,
    targetUser: User
  ): Promise<void> {
    const embed = new MessageEmbed({
      title: "차단 되었습니다.",
      description: `<@${targetUser.id}> 님이 차단되었습니다.`,
      color: DiscordColor.RED,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.reply({
      embeds: [embed],
    });
  }

  async unbanSuccess(interaction: CommandInteraction, targetUser: User) {
    const embed = new MessageEmbed({
      title: "차단해제 되었습니다.",
      description: `<@${targetUser.id}> 님이 차단해제 되었습니다.`,
      color: DiscordColor.GREEN,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.reply({
      embeds: [embed],
    });
  }

  async Error(interaction: CommandInteraction, msg: string): Promise<void> {
    const embed = new MessageEmbed({
      title: "에러",
      description: msg,
      color: DiscordColor.RED,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.reply({
      embeds: [embed],
    });
  }
}
