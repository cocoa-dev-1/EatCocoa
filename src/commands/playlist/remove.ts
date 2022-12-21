import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const plremoveCommand: EcCommand = {
  name: "제거",
  description: "플레이 리스트에서 특정 노래를 제거합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("제거")
    .setDescription("플레이 리스트에서 특정 노래를 제거합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트 이름")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("제거하고자 하는 노래의 위치")
        .setMinValue(1)
        .setRequired(true)
        .setAutocomplete(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    //option
    const plName = interaction.options.getString("playlist");
    const plIndex = interaction.options.getInteger("index");

    //manager
    const playlistManager = Container.get(PlaylistManager);

    const isExist = await playlistManager.isExist(plName);

    if (isExist) {
      const playlist = await playlistManager.get(plName);
      if (playlist.user.discordId === interaction.user.id) {
        if (plIndex <= playlist.order.length) {
          const result = await playlistManager.remove(playlist, plIndex - 1);
          await playlistManager.sendMessage(interaction, {
            title: "노래가 삭제되었습니다.",
            description: `**${plIndex}.** [${result.name}](${result.url})`,
          });
        } else {
          await playlistManager.sendMessage(interaction, {
            title: "존재하지 않는 노래입니다.",
            color: Colors.Red,
          });
        }
      } else {
        await playlistManager.sendMessage(interaction, {
          title: "본인의 플레이 리스트가 아닙니다.",
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
