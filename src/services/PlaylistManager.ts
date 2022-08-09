import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  EmbedData,
} from "discord.js";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { Playlist } from "../entities/Playlist";
import { ECDataSource } from "../loader/typeormLoader";
import { defaultFooter, defaultThumbnail } from "../utils/asset";
import { createEmbed } from "../utils/embed";
import { TrackManager } from "./TrackManager";
import { UserManager } from "./UserManager";

@Service()
export class PlaylistManager {
  private playlistRepository: Repository<Playlist>;
  constructor(
    private trackManager: TrackManager,
    private userManager: UserManager
  ) {
    this.playlistRepository = ECDataSource.getRepository(Playlist);
  }

  async isExist(plName: string): Promise<boolean> {
    const result = await this.playlistRepository.findOne({
      where: {
        name: plName,
      },
    });
    if (result) return true;
    else return false;
  }

  async create(plName: string, discordId: string): Promise<Playlist | null> {
    let user = await this.userManager.get(discordId);
    if (!user) {
      user = await this.userManager.create(discordId);
    }
    const playlist = await this.playlistRepository.create();
    playlist.name = plName;
    playlist.user = user;
    const result = await this.playlistRepository.save(playlist);
    return result;
  }

  async sendMessage(
    interaction: ChatInputCommandInteraction,
    data: EmbedData
  ): Promise<void> {
    const embed = createEmbed(data);
    await interaction.editReply({ embeds: [embed] });
  }
}
