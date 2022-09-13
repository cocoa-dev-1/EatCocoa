import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { PlaylistManager } from "../../services/PlaylistManager";
import { UserManager } from "../../services/UserManager";
import { CommandCategory, EcCommand } from "../../types/command";
import { createEmbed } from "../../utils/embed";
import { paginate } from "../../utils/pagination";

export const plplaylistCommand: EcCommand = {
  name: "플레이리스트",
  description: "개인 플레이리스트 목록을 불러옵니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("플레이리스트")
    .setDescription("개인 플레이리스트 목록을 불러옵니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const playlistManager = Container.get(PlaylistManager);
    const userManager = Container.get(UserManager);

    const user = await userManager.get(interaction.user.id);
    if (user) {
      const playlists = await playlistManager.getPlaylistByUser(user);
      const pages = await playlistManager.createPlaylistEmbedList(
        interaction,
        playlists
      );
      if (pages.length === 0) {
        await playlistManager.sendMessage(interaction, {
          title: "플레이 리스트가 없습니다.",
          color: Colors.Red,
        });
        return;
      }
      await paginate(interaction, pages);
    } else {
      await playlistManager.sendMessage(interaction, {
        title: "플레이 리스트가 없습니다.",
        color: Colors.Red,
      });
    }
  },
};
