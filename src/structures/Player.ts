import { EcCommandInteraction } from "../types/command";
import { PlayerItem, PlayerOption } from "../types/player";
import {
  GuildTextBasedChannel,
  MessageEmbed,
  TextChannel,
  VoiceBasedChannel,
} from "discord.js";
import { Item, Result } from "ytpl";
import { thumbnail } from "ytdl-core";
import { title } from "process";
import { defaultImage } from "../utils/asset";
import {
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { logger } from "../utils/logger";
import playdl from "play-dl";

export class Player {
  public queue: PlayerItem[];
  public playing: boolean;
  public voiceChannel: VoiceBasedChannel;
  public textChannel: GuildTextBasedChannel;
  public current: PlayerItem;
  public connection: VoiceConnection;

  constructor(option?: PlayerOption) {
    this.queue = [];
    this.playing = option?.playing || false;
    this.voiceChannel = option?.voiceChannel || null;
    this.textChannel = option.textChannel;
    this.current = null;
    this.connection = null;
  }

  async play() {
    if (this.queue.length > 0) {
      this.current = this.queue.shift();
      const readableStream = await playdl.stream(this.current.url, {
        discordPlayerCompatibility: true,
      });
      const player = createAudioPlayer();
      const { stream, type } = await demuxProbe(readableStream.stream);
      const resource = createAudioResource(stream, { inputType: type });
      this.connection.subscribe(player);
      this.playing = true;
      player.play(resource);
    } else {
    }
  }

  async stop() {
    this.connection.destroy();
    this.queue = [];
    this.current = null;
  }

  async connect(channel: VoiceBasedChannel) {
    this.voiceChannel = channel;
    this.connection = joinVoiceChannel({
      channelId: this.voiceChannel.id,
      guildId: this.voiceChannel.guild.id,
      adapterCreator: this.voiceChannel.guild.voiceAdapterCreator,
    });
    this.bindConnectionEvent();
  }

  async add(videoDetails: PlayerItem) {
    this.queue.push({
      id: videoDetails.id,
      title: videoDetails.title,
      thumbnail: videoDetails.thumbnail,
      url: videoDetails.url,
    });
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
  }

  bindConnectionEvent() {
    if (this.connection) {
      this.connection.on(VoiceConnectionStatus.Ready, this.onReady);
      this.connection.on(VoiceConnectionStatus.Destroyed, this.onDisconnected);
    }
  }

  onReady() {
    logger.log(`Player Ready.`);
  }

  async onDisconnected(oldState, newState) {
    try {
      await Promise.race([
        entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // Seems to be reconnecting to a new channel - ignore disconnect
    } catch (error) {
      // Seems to be a real disconnect which SHOULDN'T be recovered from
      this.connection.destroy();
    }
  }
}
