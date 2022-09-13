import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand } from "../../types/command";
import { defaultFooter } from "../../utils/asset";

export const pladdCommand: EcCommand = {
  name: "추가",
  description: "플레이 리스트에 노래를 추가합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("추가")
    .setDescription("플레이 리스트에 노래를 추가합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("노래 링크/이름")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const plName = interaction.options.getString("playlist");
    const isExist = await playlistManager.isExist(plName);
    if (isExist) {
      const url = interaction.options.getString("url");
      const [result, type] = await guildVoiceManager.search(interaction, url);
      let isPlayList = false;
      if (type === "LOAD_FAILED") {
        await playlistManager.sendMessage(interaction, {
          title: "노래를 가져오지 못했습니다.",
          color: Colors.Red,
        });
        return;
      } else if (type === "NO_MATCHES") {
        await playlistManager.sendMessage(interaction, {
          title: "노래를 찾지 못했습니다.",
          color: Colors.Red,
        });
        return;
      } else if (type === "PLAYLIST_LOADED") {
        isPlayList = true;
      }
      const [playlist, isAdded, message] = await playlistManager.add(
        plName,
        result
      );
      if (isAdded) {
        let title = "";
        let description = "";
        let thumbnail = "";
        if (isPlayList) {
          title = "재생 목록이 추가되었습니다.";
          description = `이름: [${result.playlist.name}](${result.playlist.selectedTrack.uri})`;
          thumbnail = result.playlist.selectedTrack.thumbnail;
        } else {
          title = "노래가 추가되었습니다.";
          description = `이름: [${result.tracks[0].title}](${result.tracks[0].uri})`;
          thumbnail = result.tracks[0].thumbnail;
        }
        await playlistManager.sendMessage(interaction, {
          title: title,
          description: description,
          thumbnail: {
            url: thumbnail,
          },
          footer: {
            text: `플레이 리스트: ${playlist.name}`,
            iconURL: defaultFooter.iconURL,
          },
        });
      } else {
        await playlistManager.sendMessage(interaction, {
          title: message,
          color: Colors.Red,
        });
      }
    } else {
      await playlistManager.sendMessage(interaction, {
        title: "플레이 리스트가 존재하지 않습니다.",
        color: Colors.Red,
      });
    }
  },
};
