import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { CommandCategory, EcCommand } from "../../types/command";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";

export const addCommand: EcCommand = {
  name: "추가",
  description: "플레이 리스트에 노래를 추가합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("추가")
    .setDescription("플레이 리스트에 노래를 추가합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트 이름")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("url").setDescription("유튜브 링크").setRequired(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply({ ephemeral: true });
    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const playlistName = interaction.options.getString("playlist");
    if (playlistManager.isExist(playlistName)) {
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
    } else {
      await playlistManager.sendMessage(interaction, {
        title: "플레이 리스트가 존재하지 않습니다.",
        color: Colors.Red,
      });
    }
  },
};
