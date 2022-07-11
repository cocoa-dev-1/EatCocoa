import { MessageEmbed, User } from "discord.js";
import { logger } from "../utils/logger";
import Container, { Service } from "typedi";
import { Repository } from "typeorm";
import { PlayList } from "../entities/PlayList";
import { Song } from "../entities/Song";
import { ECDataSource } from "../loader/typeormLoader";
import { EcCommandInteraction } from "../types/command";
import { DiscordColor } from "../types/discord";
import { EcSendMessageOption } from "../types/message";
import { defaultImage } from "../utils/asset";
import { winstonLogger } from "../utils/winston";
import { SongManager } from "./SongManager";
import { YtManager } from "./YtManager";

@Service()
export class PlayListManager {
  private playlistRepository: Repository<PlayList>;
  constructor(private ytManager: YtManager, private songManager: SongManager) {
    this.playlistRepository = ECDataSource.getRepository(PlayList);
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

  async get(name: string) {
    const result = await this.playlistRepository.findOne({
      where: {
        name: name,
      },
    });
    return result;
  }

  async add(name: string, url: string) {
    try {
      const isExist = await this.songManager.isExist(url);
      const playlist = await this.get(name);
      if (!isExist) {
        const song = await this.ytManager.getVideoInfo(url);
        const result = await this.songManager.create(
          song.videoDetails.title,
          url,
          playlist
        );
        if (result) return true;
        else return false;
      } else {
        const result = await this.songManager.get(url);
        if (result) return true;
        else return false;
      }
    } catch (error) {
      winstonLogger.error(error);
      logger.error("Error while adding song to playlist");
      return false;
    }
  }

  async sendMessage(option: EcSendMessageOption) {
    const embed = new MessageEmbed({
      title: option.title,
      description: option?.msg || null,
      color: option?.color || null,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await option.interaction.editReply({
      embeds: [embed],
    });
  }
}
