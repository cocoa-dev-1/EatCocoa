import { MessageEmbed, User } from "discord.js";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { PlayList } from "../entities/PlayList";
import { EatCocoaDataSource } from "../loader/typeormLoader";
import { EcCommandInteraction } from "../types/command";
import { DiscordColor } from "../types/discord";
import { defaultImage } from "../utils/asset";

@Service()
export class PlayListManager {
  private playlistRepository: Repository<PlayList>;
  constructor() {
    this.playlistRepository = EatCocoaDataSource.getRepository(PlayList);
  }
  async isExist(name: string) {
    const result = await this.playlistRepository.findOne({
      where: {
        name: name,
      },
    });
    if (result) return true;
    else return false;
  }

  async create(name: string, creator: string) {
    const playlist = this.playlistRepository.create();
    playlist.name = name;
    playlist.creator = creator;
    const { ...result } = await this.playlistRepository.save(playlist);
    return result;
  }

  async sendMessage(
    interaction: EcCommandInteraction,
    title: string,
    msg?: string,
    color?: DiscordColor
  ) {
    const embed = new MessageEmbed({
      title: title,
      description: msg || null,
      color: color || null,
      timestamp: new Date(),
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
