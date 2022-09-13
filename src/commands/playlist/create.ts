import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const plcreateCommand: EcCommand = {
  name: "생성",
  description: "플레이 리스트를 생성합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("생성")
    .setDescription("플레이 리스트를 생성합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트 이름")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);

    const plName = interaction.options.getString("playlist");
    const isExist = await playlistManager.isExist(plName);
    if (!isExist) {
      const playlist = await playlistManager.create(
        plName,
        interaction.member.user.id
      );
      if (playlist) {
        await playlistManager.sendMessage(interaction, {
          title: "플레이 리스트가 생성되었습니다.",
          description: `이름: **${playlist.name}**`,
          thumbnail: {
            url: interaction.user.avatarURL(),
          },
          footer: {
            text: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
          },
        });
      } else {
        await playlistManager.sendMessage(interaction, {
          title: "플레이 리스트 생성도중 오류가 발생하였습니다.",
          color: Colors.Red,
        });
      }
    } else {
      await playlistManager.sendMessage(interaction, {
        title: "같은 이름을 가진 플레이 리스트가 존재합니다.",
        color: Colors.Red,
      });
    }
  },
};
