import {
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  User,
  PermissionsBitField,
  ChatInputCommandInteraction,
} from "discord.js";
import { Service } from "typedi";
import { DiscordColor, DiscordPermission } from "../types/discord";
import { defaultImage } from "../utils/asset";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

@Service()
export class GuildManager {
  constructor() {}

  async ban(interaction: ChatInputCommandInteraction, targetUser: User) {
    await interaction.guild.members.ban(targetUser);
    await this.banSuccess(interaction, targetUser);
  }

  async unban(interaction: ChatInputCommandInteraction, targetUserId: string) {
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

  getUser(interaction: ChatInputCommandInteraction): User | undefined {
    return interaction.options.getUser("유저");
  }

  getBanUser(interaction: ChatInputCommandInteraction): string | undefined {
    return interaction.options.getString("유저");
  }

  async isBanned(
    interaction: ChatInputCommandInteraction,
    targetUserId: string
  ): Promise<User | undefined> {
    const targetUserCash = await interaction.guild.bans.fetch();
    const isBanned = targetUserCash.find(
      (user) => user.user.id === targetUserId
    );
    return isBanned?.user;
  }

  canBan(interaction: ChatInputCommandInteraction, targetUser: User): boolean {
    const targetUserCash = interaction.guild.members.cache.get(targetUser.id);
    const userCash = interaction.guild.members.cache.get(interaction.user.id);
    if (
      targetUserCash.roles.highest.comparePositionTo(userCash.roles.highest) >=
        0 &&
      !targetUserCash.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return true;
    }
    return false;
  }

  async canUnban(
    interaction: ChatInputCommandInteraction,
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
    interaction: ChatInputCommandInteraction,
    targetUser: User
  ): Promise<void> {
    const embed = new EmbedBuilder({
      title: "차단 되었습니다.",
      description: `<@${targetUser.id}> 님이 차단되었습니다.`,
      color: DiscordColor.Red,
      timestamp: Date.now(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.editReply({
      embeds: [embed],
    });
  }

  async unbanSuccess(
    interaction: ChatInputCommandInteraction,
    targetUser: User
  ) {
    const embed = new EmbedBuilder({
      title: "차단해제 되었습니다.",
      description: `<@${targetUser.id}> 님이 차단해제 되었습니다.`,
      color: DiscordColor.Green,
      timestamp: Date.now(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.editReply({
      embeds: [embed],
    });
  }

  async Error(
    interaction: ChatInputCommandInteraction,
    msg: string
  ): Promise<void> {
    const embed = new EmbedBuilder({
      title: "에러",
      description: msg,
      color: DiscordColor.Red,
      timestamp: Date.now(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.editReply({
      embeds: [embed],
    });
  }
}
