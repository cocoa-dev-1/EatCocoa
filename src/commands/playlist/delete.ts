import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const pldeleteCommand: EcCommand = {
  name: "삭제",
  description: "플레이 리스트를 삭제합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("삭제")
    .setDescription("플레이 리스트를 삭제합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트 이름")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const playlistManager = Container.get(PlaylistManager);

    const plName = interaction.options.getString("playlist");

    const isExist = await playlistManager.isExist(plName);
    if (isExist) {
      const owner = await playlistManager.getUserByPlaylist(plName);
      if (interaction.user.id === owner.discordId) {
        const result = await playlistManager.delete(plName);
        if (result) {
          await playlistManager.sendMessage(interaction, {
            title: `\`${plName}\` 플레이 리스트가 삭재되었습니다.`,
            footer: {
              text: interaction.user.tag,
              iconURL: interaction.user.avatarURL(),
            },
          });
        } else {
          await playlistManager.sendMessage(interaction, {
            title: "삭제 도중 에러가 발생하였습니다.",
            color: Colors.Red,
          });
        }
      } else {
        await playlistManager.sendMessage(interaction, {
          title: "플레이 리스트의 생성자가 아닙니다.",
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
