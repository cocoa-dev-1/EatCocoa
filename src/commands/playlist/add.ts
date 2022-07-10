import { SlashCommandBuilder } from "@discordjs/builders";
import Container from "typedi";
import { PlayListManager } from "../../services/PlayListManager";
import { YtManager } from "../../services/YtManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";
import { DiscordColor } from "../../types/discord";

export const addCommand: EcCommand = {
  name: "추가",
  description: "플레이 리스트에 노래를 추가합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("추가")
    .setDescription("플레이 리스트에 노래를 추가합니다.")
    .addStringOption((option) =>
      option
        .setName("플레이 리스트 이름")
        .setDescription("플레이 리스트 이름을 입력하세요.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("노래 URL")
        .setDescription("추가할 노래의 유튜브 링크를 입력하세요.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    const playListName = interaction.options.getString("플레이 리스트 이름");
    const songUrl = interaction.options.getString("노래 URL");
    const playListManager = Container.get(PlayListManager);
    const ytManager = Container.get(YtManager);
    if (await playListManager.isExist(playListName)) {
      const isUrl = ytManager.validate(songUrl);
      if (isUrl) {
        const result = await playListManager.add(playListName, songUrl);
      } else {
        await playListManager.sendMessage({
          interaction: interaction,
          title: "유튜브 url이 아닙니다.",
          msg: `[입력된 링크](${playListName})`,
          color: DiscordColor.RED,
        });
      }
    } else {
      await playListManager.sendMessage({
        interaction: interaction,
        title: "존재하지 않는 플레이 리스트입니다.",
        msg: `이름: ${playListName}`,
        color: DiscordColor.RED,
      });
    }
  },
};
