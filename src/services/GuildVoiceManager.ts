import {
  ChatInputCommandInteraction,
  Embed,
  EmbedBuilder,
  EmbedData,
  SelectMenuComponentOptionData,
  VoiceBasedChannel,
} from "discord.js";
import { LoadType, SearchResult, Track } from "erela.js";
import { invalid } from "moment";
import { Service } from "typedi";
import { manager } from "../loader/managerLoader";
import { PlayerCheckOption } from "../types/player";
import { defaultFooter, defaultThumbnail } from "../utils/asset";
import { createEmbed } from "../utils/embed";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

@Service()
export class GuildVoiceManager {
  constructor() {}

  isExist(interaction: ChatInputCommandInteraction): boolean {
    const player = manager.get(interaction.guild.id);
    if (player) {
      return true;
    } else {
      return false;
    }
  }

  async check(
    interaction: ChatInputCommandInteraction,
    option: PlayerCheckOption
  ): Promise<[boolean, string]> {
    const userVoiceChannel = this.getUserVoiceChannel(interaction);
    const player = manager.get(interaction.guild.id);
    let inSameChannel = true;
    if (player && userVoiceChannel) {
      inSameChannel = userVoiceChannel.id === player.voiceChannel;
    }
    if (option.inVoiceChannel && !userVoiceChannel) {
      return [false, "음성채널에 접속해야합니다."];
    }
    if (option.inSameChannel && !inSameChannel) {
      return [false, "같은 음성방에 있어야 합니다."];
    }
    if (option.isPlayerExist && !player) {
      return [false, "플레이어가 없습니다."];
    }
    return [true, ""];
  }

  async search(
    interaction: ChatInputCommandInteraction,
    song: string
  ): Promise<[SearchResult, LoadType]> {
    const result = await manager.search(song, interaction.member);
    return [result, result.loadType];
  }

  async loop(
    interaction: ChatInputCommandInteraction
  ): Promise<[string, boolean]> {
    const player = manager.get(interaction.guild.id);
    const type = interaction.options.getSubcommand();
    if (type === "노래") {
      player.setTrackRepeat(!player.trackRepeat);
      return [type, player.trackRepeat];
    } else if (type === "재생목록") {
      player.setQueueRepeat(!player.queueRepeat);
      return [type, player.queueRepeat];
    }
  }

  async pause(interaction: ChatInputCommandInteraction): Promise<boolean> {
    const player = manager.get(interaction.guild.id);
    player.pause(!player.paused);
    return player.paused;
  }

  async skip(interaction: ChatInputCommandInteraction): Promise<boolean> {
    const player = manager.get(interaction.guild.id);
    try {
      if (player.queue.current) player.stop();
      else return false;
      return true;
    } catch (error) {
      winstonLogger.error(error);
      logger.error("error while skiping track");
      return false;
    }
  }

  async stop(interaction: ChatInputCommandInteraction): Promise<boolean> {
    const player = manager.get(interaction.guild.id);
    try {
      player.destroy();
      return true;
    } catch (error) {
      winstonLogger.error(error);
      logger.error("error while stoping player");
      return false;
    }
  }

  async setVolume(
    interaction: ChatInputCommandInteraction
  ): Promise<number | null> {
    const volume = interaction.options.getInteger("음량");
    const player = manager.get(interaction.guild.id);
    player.setVolume(volume);
    return player.volume;
  }

  createSongSelectList(songList: Track[]): SelectMenuComponentOptionData[] {
    const result: SelectMenuComponentOptionData[] = [];
    songList.forEach((track) => {
      result.push({
        label: track.title,
        description: track.author,
        value: track.uri,
      });
    });
    return result;
  }

  createQueueEmbedList(
    interaction: ChatInputCommandInteraction
  ): EmbedBuilder[] {
    const player = manager.get(interaction.guild.id);
    const queue = player.queue;
    let embeds = [];
    let k = 10;
    for (let i = 0; i < queue.size; i += 10) {
      const currentPage = queue.slice(i, k);
      let j = i;
      k += 10;
      const info = currentPage
        .map((track) => {
          return `${++j}) [${track.title}](${track.thumbnail})`;
        })
        .join("\n");
      const embed = new EmbedBuilder({
        title: "재생목록",
        description: `**현재 재생중: [${player.queue.current.title}](${player.queue.current.thumbnail})**\n${info}`,
      });
      embeds.push(embed);
    }
    return embeds;
  }

  getUserVoiceChannel(
    interaction: ChatInputCommandInteraction
  ): VoiceBasedChannel {
    const guildUser = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    return guildUser.voice.channel;
  }

  async sendMessage(
    interaction: ChatInputCommandInteraction,
    data: EmbedData
  ): Promise<void> {
    const embed = createEmbed(data);
    await interaction.editReply({ embeds: [embed] });
  }
}
