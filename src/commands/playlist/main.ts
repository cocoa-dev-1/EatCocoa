import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  MessageComponentInteraction,
  SelectMenuBuilder,
  SelectMenuInteraction,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { playlistSubCommandCollections } from ".";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand } from "../../types/command";
import { createEmbed } from "../../utils/embed";
import { winstonLogger } from "../../utils/winston";

export const plmainCommand: EcCommand = {
  name: "플레이리스트",
  description: "플레이 리스트 커맨드 입니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("플레이리스트")
    .setDescription("플레이 리스트 커맨드 입니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply({ ephemeral: true });
    const playlistManager = Container.get(PlaylistManager);
    const commandList = await playlistManager.createCommandList();
    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId("playlist")
        .setPlaceholder("커맨드를 선택하세요.")
        .addOptions(commandList)
    );
    const songEmbed = createEmbed({
      title: "플레이 리스트 명령어를 선택하세요.",
      description: "30초 안에 선택해야합니다",
    });
    await interaction.editReply({
      embeds: [songEmbed],
      components: [row],
    });
    const collector =
      interaction.channel.createMessageComponentCollector<ComponentType.SelectMenu>(
        {
          time: 30000,
        }
      );
    collector.on("collect", async (i: SelectMenuInteraction) => {
      if (i.customId === "playlist" && i.isSelectMenu()) {
        const command = playlistSubCommandCollections.get(i.values[0]);
        try {
          await command.execute(i);
        } catch (error) {
          winstonLogger.error(error);
          console.log(error);
        }
        await interaction.editReply({ components: [] });
        collector.stop();
      }
    });
  },
};
