import { Guild, MessageEmbed, VoiceBasedChannel } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { Service } from "typedi";
import { Player } from "../structures/Player";
import { EcCommandInteraction } from "../types/command";
import { DiscordColor } from "../types/discord";
import { defaultImage } from "../utils/asset";
import { YtManager } from "./YtManager";
import { Video } from "ytsr";
import { Manager } from "../structures/Manager";

@Service()
export class GuildVoiceManager {
  ytManager: YtManager;
  constructor() {
    this.ytManager = new YtManager();
  }

  async getPlayer(interaction: EcCommandInteraction, guildId: string) {
    const { music } = interaction.client;
    let musicPlayer = await music.getPlayer(guildId);
    if (musicPlayer === undefined) {
      musicPlayer = await music.newPlayer(guildId, {
        textChannel: interaction.channel,
      });
    }
    return musicPlayer;
  }

  async check(
    interaction: EcCommandInteraction,
    guildId: string
  ): Promise<boolean> {
    const isInVoice = await this.inVoiceCheck(interaction);
    const botVoiceChannel = interaction.guild.me.voice.channel;
    if (isInVoice) {
      if (botVoiceChannel) {
        const isInSameVoice = await this.inSameVoiceCheck(
          interaction,
          botVoiceChannel
        );
        if (isInSameVoice) {
          return true;
        } else {
          await this.Error(interaction, "같은 음성방에 들어가있지 않습니다.");
          return false;
        }
      } else {
        return true;
      }
    } else {
      await this.Error(interaction, "음성방에 들어가있지 않습니다.");
      return false;
    }
  }

  async inVoiceCheck(interaction: EcCommandInteraction): Promise<boolean> {
    const channel = await this.getUserVoiceChannel(interaction);
    if (channel) return true;
    else return false;
  }

  async inSameVoiceCheck(
    interaction: EcCommandInteraction,
    botVoiceChannel: VoiceBasedChannel
  ): Promise<boolean> {
    const channel = await this.getUserVoiceChannel(interaction);
    if (botVoiceChannel.equals(channel)) {
      return true;
    } else {
      return false;
    }
  }

  async getUserVoiceChannel(interaction: EcCommandInteraction) {
    const user = interaction.guild.members.cache.get(interaction.user.id);
    const channel = user.voice.channel;
    return channel;
  }

  async play(
    interaction: EcCommandInteraction,
    musicPlayer: Player,
    url: string
  ) {
    const validatedUrl = this.ytManager.validate(url);
    if (validatedUrl) {
      const isList = this.ytManager.listCheck(url);
      if (isList) {
        const playList = await this.ytManager.getPlayList(url);
        await musicPlayer.addList(playList);
      } else {
        const video = await this.ytManager.getVideoInfo(url);
        const videoDetails = video.videoDetails;
        await musicPlayer.add({
          id: videoDetails.videoId,
          title: videoDetails.title,
          thumbnail: videoDetails.thumbnails[0],
          url: videoDetails.video_url,
        });
        // await musicPlayer.add(videoDetails);
      }
    } else {
      const videos = await this.ytManager.search(url);
      if (!videos.length) {
        return await this.Error(interaction, "곡을 찾지 못했습니다.");
      }
      if (videos[0].type === "video") {
        await musicPlayer.add({
          id: videos[0].id,
          title: videos[0].title,
          thumbnail: videos[0].bestThumbnail,
          url: videos[0].url,
        });
      } else {
        return await this.Error(interaction, "곡을 찾지 못했습니다.");
      }
    }
    await this.Success(interaction, musicPlayer);
    if (!musicPlayer.playing) {
      const voiceChannel = await this.getUserVoiceChannel(interaction);
      await musicPlayer.connect(voiceChannel);
      await musicPlayer.play();
    }
  }

  async Success(interaction: EcCommandInteraction, musicPlayer: Player) {
    const music = musicPlayer.queue[musicPlayer.queue.length - 1];
    const embed = new MessageEmbed({
      title: "노래를 추가했습니다!",
      description: music.title,
      image: music.thumbnail,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.reply({
      embeds: [embed],
    });
  }

  async Error(interaction: EcCommandInteraction, msg: string) {
    const embed = new MessageEmbed({
      title: "에러",
      description: msg,
      color: DiscordColor.RED,
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.reply({
      embeds: [embed],
    });
  }
}
