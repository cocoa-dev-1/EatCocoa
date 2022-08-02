import {
  Guild,
  GuildBasedChannel,
  GuildChannel,
  Message,
  ActionRowBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  VoiceBasedChannel,
  SelectMenuComponentOptionData,
  MessageActionRowComponentBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { Service } from "typedi";
import { Player } from "../structures/Player";
import { EcCommand } from "../types/command";
import { DiscordColor } from "../types/discord";
import { defaultImage } from "../utils/asset";
import { YtManager } from "./YtManager";
import { Item, Video } from "ytsr";
import { Result } from "ytpl";
import { Manager } from "../structures/Manager";
import { title } from "process";
import { music } from "../index";

@Service()
export class GuildVoiceManager {
  constructor(public ytManager: YtManager) {}

  async hasPlayer(interaction: ChatInputCommandInteraction) {
    const checkPlayer = await music.hasPlayer(interaction.guild.id);
    return checkPlayer;
  }

  async getPlayer(
    interaction: ChatInputCommandInteraction,
    guildId: string,
    create?: boolean
  ) {
    let musicPlayer = await music.getPlayer(guildId);
    if (musicPlayer === undefined) {
      if (create) {
        musicPlayer = await music.newPlayer(guildId, {
          textChannel: interaction.channel,
        });
      } else {
        return null;
      }
    }
    return musicPlayer;
  }

  async check(
    interaction: ChatInputCommandInteraction,
    guildId: string
  ): Promise<boolean> {
    const isInVoice = await this.inVoiceCheck(interaction);
    const connection = getVoiceConnection(interaction.guild.id);
    const botVoiceChannel = await interaction.guild.channels.cache.get(
      connection.joinConfig.channelId
    );
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

  async inVoiceCheck(
    interaction: ChatInputCommandInteraction
  ): Promise<boolean> {
    const channel = await this.getUserVoiceChannel(interaction);
    if (channel) return true;
    else return false;
  }

  async inSameVoiceCheck(
    interaction: ChatInputCommandInteraction,
    botVoiceChannel: GuildBasedChannel
  ): Promise<boolean> {
    const channel = await this.getUserVoiceChannel(interaction);
    if (botVoiceChannel.id === channel.id) {
      return true;
    } else {
      return false;
    }
  }

  async getUserVoiceChannel(interaction: ChatInputCommandInteraction) {
    const user = interaction.guild.members.cache.get(interaction.user.id);
    const channel = user.voice.channel;
    return channel;
  }

  async play(
    interaction: ChatInputCommandInteraction,
    musicPlayer: Player,
    url: string
  ) {
    const validatedUrl = this.ytManager.validate(url);
    const isList = this.ytManager.listCheck(url);
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
    if (isList) {
      await this.playSuccess(
        interaction,
        musicPlayer,
        await this.ytManager.getPlayList(url)
      );
    } else {
      await this.playSuccess(interaction, musicPlayer);
    }
    if (!musicPlayer.playing) {
      const voiceChannel = await this.getUserVoiceChannel(interaction);
      await musicPlayer.connect(voiceChannel);
      await musicPlayer.play();
    }
  }

  async playSuccess(
    interaction: ChatInputCommandInteraction,
    musicPlayer: Player,
    list?: Result
  ) {
    const music = musicPlayer.queue[musicPlayer.queue.length - 1];
    let title = list ? "플레이 리스트를 추가했습니다." : "노래를 추가했습니다.";
    let description = list?.title || music.title;
    let thumbnail = list?.bestThumbnail || music.thumbnail;
    const embed = new EmbedBuilder({
      title: title,
      description: description,
      image: thumbnail,
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

  async stop(interaction: ChatInputCommandInteraction, musicPlayer: Player) {
    if (musicPlayer.playing || musicPlayer.queue.length > 0) {
      await musicPlayer.stop();
      await this.stopSuccess(interaction, "노래 재생을 종료했습니다.");
    } else {
      await this.Error(interaction, "재생중인 곡이 없습니다.");
    }
  }

  async stopSuccess(interaction: ChatInputCommandInteraction, msg: string) {
    const embed = new EmbedBuilder({
      title: msg,
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

  async pause(interaction: ChatInputCommandInteraction) {
    const musicPlayer = await this.getPlayer(interaction, interaction.guild.id);
    if (musicPlayer?.playing) {
      const pause = await musicPlayer.pause();
      if (pause) {
        await this.pauseSuccess(interaction, "pause");
      } else {
        await this.Error(interaction, "노래를 일시정지 하지 못했습니다.");
      }
    } else {
      const resume = await musicPlayer.resume();
      if (resume) {
        await this.pauseSuccess(interaction, "resume");
      } else {
        await this.Error(interaction, "노래를 재생 하지 못했습니다.");
      }
    }
  }

  async pauseSuccess(
    interaction: ChatInputCommandInteraction,
    type: "pause" | "resume"
  ) {
    let title = "";
    if (type === "pause") {
      title = "노래를 일시정지 했습니다.";
    } else if (type === "resume") {
      title = "노래를 다시 재생합니다.";
    }
    const embed = new EmbedBuilder({
      title: title,
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

  async skip(interaction: ChatInputCommandInteraction) {
    const musicPlayer = await this.getPlayer(interaction, interaction.guild.id);
    const currentSong = musicPlayer.current.title;
    if (musicPlayer) {
      const skip = await musicPlayer.skip();
      if (skip) {
        await this.skipSuccess(interaction, currentSong);
      } else {
        await this.Error(interaction, "노래를 스킵 하지 못했습니다.");
      }
    }
  }

  async skipSuccess(interaction: ChatInputCommandInteraction, msg: string) {
    const embed = new EmbedBuilder({
      title: "노래를 스킵했습니다.",
      description: msg,
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

  async search(interaction: ChatInputCommandInteraction) {
    const song = interaction.options.getString("song");
    const result = await this.ytManager.search(song);
    const resultActionList =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new SelectMenuBuilder()
          .setCustomId("search")
          .setPlaceholder("노래를 선택하세요.")
          .addOptions(await this.createResultOptions(result))
      );
    const embed = new EmbedBuilder({
      title: "노래를 선택하세요",
      description: "30초 안에 선택해야합니다",
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.editReply({
      embeds: [embed],
      components: [resultActionList],
    });
    //await this.createActionList(result);
  }

  async createResultOptions(
    result: Item[]
  ): Promise<SelectMenuComponentOptionData[]> {
    const resultOptions = result.map((element) => {
      if (element.type === "video") {
        if (element.title !== undefined || element.title !== null) {
          return {
            label: element.title,
            description: element.description,
            value: element.url,
          };
        }
      }
    });
    const finalResult = resultOptions.filter((data) => data !== undefined);
    return finalResult;
  }

  async loop(interaction: ChatInputCommandInteraction) {
    const musicPlayer = await this.getPlayer(interaction, interaction.guild.id);
    if (musicPlayer) {
      const loopResult = musicPlayer.loop();
      if (loopResult) {
        await this.loopSuccess(
          interaction,
          "플레이 리스트 루프가 설정 되었습니다."
        );
      } else {
        await this.loopSuccess(
          interaction,
          "플레이 리스트 루프가 설정해제 되었습니다."
        );
      }
    }
  }

  async loopSuccess(interaction: ChatInputCommandInteraction, msg: string) {
    const embed = new EmbedBuilder({
      title: msg,
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

  async Error(interaction: ChatInputCommandInteraction, msg: string) {
    const embed = new EmbedBuilder({
      title: "에러",
      description: msg,
      color: DiscordColor.Red,
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
