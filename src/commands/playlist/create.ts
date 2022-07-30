import { SlashCommandBuilder } from "@discordjs/builders";
import { DiscordColor } from "../../types/discord";
import { CommandInteraction } from "discord.js";
import Container from "typedi";
import { PlayListManager } from "../../services/PlayListManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const createCommand: EcCommand = {
  name: "생성",
  description: "플레이 리스트를 생성합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("생성")
    .setDescription("플레이 리스트를 생성합니다.")
    .addStringOption((option) =>
      option
        .setName("이름")
        .setDescription("리스트 이름을 지정합니다.")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const playListManager = Container.get(PlayListManager);
    const listName = interaction.options.getString("이름");
    const exist = await playListManager.isExist(listName);
    if (!exist) {
      const result = await playListManager.create(
        listName,
        interaction.member.user.id
      );
      if (result) {
        await playListManager.sendMessage({
          interaction: interaction,
          title: "플레이 리스트가 생성되었습니다.",
          msg: `이름: ${result.name}`,
        });
      } else {
        await playListManager.sendMessage({
          interaction: interaction,
          title: "플레이 리스트를 생성하던중 오류가 발생했습니다.",
          color: DiscordColor.Red,
        });
      }
    } else {
      await playListManager.sendMessage({
        interaction: interaction,
        title: "이미 존재하는 플레이리스트 이름입니다.",
        msg: `이름: ${listName}`,
        color: DiscordColor.Red,
      });
    }
  },
};
