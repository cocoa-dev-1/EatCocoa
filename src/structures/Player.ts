import { EcCommandInteraction } from "../types/command";
import { PlayerItem, PlayerOption } from "../types/player";
import {
  GuildTextBasedChannel,
  MessageEmbed,
  TextChannel,
  VoiceBasedChannel,
} from "discord.js";
import { Item, Result } from "ytpl";
import { MoreVideoDetails, thumbnail } from "ytdl-core";
import { title } from "process";
import { defaultImage } from "../utils/asset";

export class Player {
  private queue: PlayerItem[];
  public playing: boolean;
  public voiceChannel: VoiceBasedChannel;
  public textChannel: GuildTextBasedChannel;
  public current: Item;

  constructor(option?: PlayerOption) {
    this.queue = [];
    this.playing = option?.playing || false;
    this.voiceChannel = option?.voiceChannel || null;
    this.textChannel = option.textChannel;
    this.current = null;
  }

  async play() {}

  async connect(channel: VoiceBasedChannel) {
    this.voiceChannel = channel;
  }

  async add(videoDetails: MoreVideoDetails) {
    this.queue.push({
      id: videoDetails.videoId,
      title: videoDetails.title,
      thumbnail: {
        url: videoDetails.thumbnails[0].url,
        height: videoDetails.thumbnails[0].height,
        width: videoDetails.thumbnails[0].width,
      },
      url: videoDetails.video_url,
    });
    await this.sendAddedSong("노래가", title, videoDetails.thumbnails[0]);
  }

  async addList(videos: Result) {
    videos.items.forEach((videoDetails) => {
      this.queue.push({
        id: videoDetails.id,
        title: videoDetails.title,
        thumbnail: {
          url: videoDetails.bestThumbnail.url,
          height: videoDetails.bestThumbnail.height,
          width: videoDetails.bestThumbnail.width,
        },
        url: videoDetails.url,
      });
    });
    await this.sendAddedSong("재생 목록이", videos.title, videos.bestThumbnail);
  }

  async sendAddedSong(name: string, song: string, thumbnail: thumbnail) {
    const embed = new MessageEmbed({
      title: `${name} 추가되었습니다.`,
      description: song,
      image: {
        url: thumbnail.url,
        height: thumbnail.height,
        width: thumbnail.width,
      },
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await this.textChannel.send({
      embeds: [embed],
    });
  }
}
