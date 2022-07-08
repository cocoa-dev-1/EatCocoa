import { PlayerItem, PlayerOption } from "../types/player";
import {
  GuildTextBasedChannel,
  MessageEmbed,
  VoiceBasedChannel,
} from "discord.js";
import { Item, Result } from "ytpl";
import { thumbnail } from "ytdl-core";
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  PlayerSubscription,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { logger } from "../utils/logger";
import playdl from "play-dl";
import { defaultImage } from "../utils/asset";
import { winstonLogger } from "../utils/winston";
import { client } from "../index";

export class Player {
  public queue: PlayerItem[];
  public playing: boolean;
  public voiceChannel: VoiceBasedChannel;
  public textChannel: GuildTextBasedChannel;
  public position: number;
  public current: PlayerItem;
  public connection: VoiceConnection;
  private player: AudioPlayer;
  private currentResource: AudioResource;
  private subscription: PlayerSubscription;
  private endless: boolean;

  constructor(option?: PlayerOption) {
    this.queue = [];
    this.playing = option?.playing || false;
    this.voiceChannel = option?.voiceChannel || null;
    this.textChannel = option.textChannel;
    this.current = null;
    this.currentResource = null;
    this.connection = null;
    this.player = null;
    this.subscription = null;
    this.position = 0;
    this.endless = false;
  }

  async play() {
    this.current = this.getCurrentQueue(0);
    const readableStream = await playdl.stream(this.current.url, {
      discordPlayerCompatibility: true,
    });
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const { stream, type } = await demuxProbe(readableStream.stream);
    const resource = createAudioResource(stream, { inputType: type });
    this.subscription = this.connection.subscribe(this.player);
    this.playing = true;
    this.player.play(resource);
    this.currentResource = resource;
    this.bindPlayerEvnet();
  }

  getCurrentQueue(position: number) {
    return this.queue[position];
  }

  setNextPosition() {
    if (this.endless) {
      this.position = this.queue.length % (this.position + 1);
    } else {
      this.position = this.position + 1;
    }
  }

  async nextQueue() {
    if (this.queue.length - 1 > this.position || this.endless) {
      this.setNextPosition();
      this.current = this.getCurrentQueue(this.position);
      const readableStream = await playdl.stream(this.current.url, {
        discordPlayerCompatibility: true,
      });
      const { stream, type } = await demuxProbe(readableStream.stream);
      const resource = createAudioResource(stream, {
        inputType: type,
        metadata: {
          title: this.current.title,
        },
      });
      this.subscription = this.connection.subscribe(this.player);
      this.player.play(resource);
      this.currentResource = resource;
    } else {
      // await this.sendMessage(this.textChannel, "노래를 모두 재생하였습니다.");
      await this.stop();
    }
  }

  async pause() {
    if (this.player) {
      const pauseStatus = this.player.pause();
      return pauseStatus;
    }
  }

  async resume() {
    if (this.player) {
      const unPauseStatus = this.player.unpause();
      return unPauseStatus;
    }
  }

  async skip() {
    if (this.current) {
      this.nextQueue();
      return true;
    } else {
      return false;
    }
  }

  loop() {
    this.endless = !this.endless;
    return this.endless;
  }

  async stop() {
    this.player.stop();
    this.subscription.unsubscribe();
    this.playing = false;
    this.queue = [];
    this.current = null;
    this.connection.disconnect();
    this.remove();
  }

  async remove() {
    const { music } = client;
    await music.removePlayer(this.textChannel.guild.id);
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

  getRemainingQueue() {
    return this.queue.slice(this.position);
  }

  bindPlayerEvnet() {
    if (this.player) {
      this.player.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
        this.onPlayerIdle(this, oldState, newState);
      });
      this.player.on("error", async (error) => {
        this.onPlayerError(this, error);
      });
      this.player.on("stateChange", this.onPlayerStateChange);
    }
  }

  bindConnectionEvent() {
    if (this.connection) {
      this.connection.on(VoiceConnectionStatus.Ready, this.onReady);
      this.connection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
          await this.onDisconnected(this, oldState, newState);
        }
      );
    }
  }

  async onPlayerError(player: Player, error) {
    winstonLogger.error(error);
    logger.error(
      `Error: ${error.message} with resource ${error.resource.metadata.title}`
    );
    await player.sendMessage(
      player.textChannel,
      `${error.resource.metadata.title} 에서 오류가 발생해 다음곡을 재생합니다.`
    );
    await player.nextQueue();
  }

  async onPlayerIdle(player: Player, oldState, newState) {
    await player.nextQueue();
  }

  onPlayerStateChange(oldState, newState) {
    logger.log(
      `Audio player transitioned from ${oldState.status} to ${newState.status}`
    );
  }

  onReady() {
    logger.log(`Player Ready.`);
  }

  async onDisconnected(player: Player, oldState, newState) {
    try {
      await Promise.race([
        entersState(player.connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(player.connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // Seems to be reconnecting to a new channel - ignore disconnect
    } catch (error) {
      // Seems to be a real disconnect which SHOULDN'T be recovered from
      player.connection.destroy();
      await player.remove();
      await player.sendMessage(player.textChannel, "재생이 종료되었습니다.");
    }
  }

  async sendMessage(channel: GuildTextBasedChannel, message: string) {
    const embed = new MessageEmbed({
      title: message,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await channel.send({
      embeds: [embed],
    });
  }
}
