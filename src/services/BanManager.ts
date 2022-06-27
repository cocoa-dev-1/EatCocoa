import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { Service } from "typedi";
import { DiscordColor } from "../types/discord";
import { defaultImage } from "../utils/asset";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

@Service()
export class BanManager {
  interaction: CommandInteraction;
  constructor() {}

  async banUser(interaction: CommandInteraction) {
    this.interaction = interaction;
    try {
      const targetUser = this.getUser();
      const canBan = this.checkPermission(targetUser);
      if (canBan) {
        this.interaction.guild.members.ban(targetUser);
        const embed = new MessageEmbed()
          .setColor(DiscordColor.GREEN)
          .setTitle("유저 밴이 완료되었습니다!")
          .setDescription(`${targetUser.tag}님을 밴하였습니다.`)
          .setThumbnail(defaultImage)
          .setTimestamp()
          .setFooter({
            text: "코코아 봇",
            iconURL: defaultImage
          });
        await this.interaction.reply({
          embeds: [embed]
        });
      } else {
        const embed = new MessageEmbed()
          .setColor(DiscordColor.RED)
          .setTitle("에러")
          .setDescription("해당 유저가 권한이 높아 밴이 불가능합니다.")
          .setThumbnail(defaultImage)
          .setTimestamp()
          .setFooter({
            text: "코코아 봇",
            iconURL: defaultImage
          });
        await this.interaction.reply({
          embeds: [embed]
        });
      }
    } catch(error) {
      const embed = new MessageEmbed()
        .setColor(DiscordColor.RED)
        .setTitle("에러")
        .setDescription("해당 유저가 권한이 높아 밴이 불가능합니다.")
        .setThumbnail(defaultImage)
        .setTimestamp()
        .setFooter({
          text: "코코아 봇",
          iconURL: defaultImage
        });
      await this.interaction.reply({
        embeds: [embed]
      });
      winstonLogger.error(error);
      logger.error("Error while executing BanManager");
    }
  }

  getUser() {
    return this.interaction.options.getUser("유저");
  }

  checkPermission(targetUser: User) {
    const targetUserCash = this.interaction.guild.members.cache.get(targetUser.id);
    const userCash = this.interaction.guild.members.cache.get(this.interaction.user.id);
    if (targetUserCash.roles.highest.comparePositionTo(userCash.roles.highest) >= 0) {
      return true;
    }
    return false;
  }
}