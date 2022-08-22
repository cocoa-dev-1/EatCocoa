import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  EmbedData,
  ModalSubmitInteraction,
  SelectMenuComponentOptionData,
  SelectMenuInteraction,
} from "discord.js";
import { SearchResult } from "erela.js";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { playlistSubCommands } from "../commands/playlist";
import { Playlist } from "../entities/Playlist";
import { Track } from "../entities/Track";
import { ECDataSource } from "../loader/typeormLoader";
import { EcPlCommand } from "../types/command";
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

  async get(plName: string): Promise<Playlist | null> {
    const result = await this.playlistRepository.findOne({
      where: {
        name: plName,
      },
      relations: ["tracks"],
    });
    if (result) return result;
    else return null;
  }

  async add(
    plName: string,
    song: SearchResult
  ): Promise<[Playlist | null, boolean, string]> {
    let playlist = await this.get(plName);
    if (playlist) {
      if (song.playlist) {
        song.tracks.forEach(async (track) => {
          const result = await this.trackManager.create(track);
          playlist.tracks.push(result);
          playlist.order.push(result.id);
        });
      } else {
        const result = await this.trackManager.create(song.tracks[0]);
        playlist.tracks.push(result);
        playlist.order.push(result.id);
      }
      playlist = await this.playlistRepository.save(playlist);
      return [playlist, true, ""];
    } else {
      return [null, false, "플레이 리스트가 존재하지 않습니다."];
    }
  }

  async createCommandList(): Promise<SelectMenuComponentOptionData[]> {
    const result: SelectMenuComponentOptionData[] = playlistSubCommands.map(
      (command) => {
        return {
          label: command.name,
          description: command.description,
          value: command.name,
        };
      }
    );
    return result;
  }

  async sendMessage(
    interaction: ChatInputCommandInteraction,
    data: EmbedData
  ): Promise<void> {
    const embed = createEmbed(data);
    await interaction.editReply({ embeds: [embed] });
  }

  async updateMessage(
    interaction: SelectMenuInteraction,
    data: EmbedData
  ): Promise<void> {
    const embed = createEmbed(data);
    await interaction.update({ embeds: [embed] });
  }

  async modalMessage(
    interaction: ModalSubmitInteraction,
    data: EmbedData
  ): Promise<void> {
    const embed = createEmbed(data);
    await interaction.reply({ embeds: [embed] });
  }
}
