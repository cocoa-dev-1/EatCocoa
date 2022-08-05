import { SlashCommandBuilder } from "@discordjs/builders";
import {
  APIEmbedImage,
  APIEmbedThumbnail,
  ChatInputCommandInteraction,
  Colors,
  CommandInteraction,
} from "discord.js";
import { Player } from "erela.js";
import { Container } from "typedi";
import { manager } from "../../loader/managerLoader";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const playCommand: EcCommand = {
  name: "재생",
  description: "노래 재생하기",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) =>
      option
        .setName("노래")
        .setRequired(true)
        .setDescription("노래의 URL 또는 노래 이름")
    )
    .toJSON(),
  async execute(
    interaction: ChatInputCommandInteraction,
    guildId: string
  ): Promise<void> {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const url = interaction.options.getString("노래");
    if (url) {
      const [check, message] = await guildVoiceManager.check(interaction, {
        inSameChannel: true,
        inVoiceChannel: true,
      });
      if (check) {
        const [result, type] = await guildVoiceManager.search(interaction, url);
        let isPlayList = false;
        if (type === "LOAD_FAILED") {
          await guildVoiceManager.sendMessage(interaction, {
            title: "노래를 가져오지 못했습니다.",
            color: Colors.Red,
          });
          return;
        } else if (type === "NO_MATCHES") {
          await guildVoiceManager.sendMessage(interaction, {
            title: "노래를 찾지 못했습니다.",
            color: Colors.Red,
          });
          return;
        } else if (type === "PLAYLIST_LOADED") {
          isPlayList = true;
        }
        const isExist = guildVoiceManager.isExist(interaction);
        let player: Player = null;
        if (isExist) {
          player = manager.get(interaction.guild.id);
        } else {
          const userVoiceChannel =
            guildVoiceManager.getUserVoiceChannel(interaction);
          player = manager.create({
            guild: interaction.guild.id,
            voiceChannel: userVoiceChannel.id,
            textChannel: interaction.channel.id,
            volume: 50,
            selfDeafen: true,
          });
          player.connect();
        }
        if (!isPlayList) {
          player.queue.add(result.tracks[0]);
        } else {
          player.queue.add(result.tracks);
        }

        if (!isExist) {
          if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
          }
        }
        let title = "노래가 추가되었습니다.";
        let description = `[${result.tracks[0].title}](${result.tracks[0].uri})`;
        let thumbnail: APIEmbedThumbnail = {
          url: result.tracks[0].thumbnail,
        };
        if (isPlayList) {
          title = "재생목록이 추가되었습니다.";
          description = `${result.playlist.name}`;
          thumbnail = {
            url: result.playlist.selectedTrack.thumbnail,
          };
        }
        await guildVoiceManager.sendMessage(interaction, {
          title: title,
          description: description,
          thumbnail: thumbnail,
          footer: {
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          },
        });
        return;
      } else {
        await guildVoiceManager.sendMessage(interaction, {
          title: message,
          color: Colors.Red,
        });
        return;
      }
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: "음악의 링크/제목을 다시 입력해주세요.",
        color: Colors.Red,
      });
      return;
    }
  },
};
