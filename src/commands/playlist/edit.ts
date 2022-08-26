import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import Container from "typedi";
import { PlaylistManager } from "../../services/PlaylistManager";
import { EcPlCommand } from "../../types/command";

export const pleditCommand: EcPlCommand = {
  name: "수정",
  description: "플레이 리스트 내용을 수정합니다.",
  async execute(interaction: SelectMenuInteraction) {
    const playlistManager = Container.get(PlaylistManager);
    const modal = new ModalBuilder()
      .setTitle("플레이 리스트를 수정합니다.")
      .setCustomId("plEdit");

    const playlistNameINput = new TextInputBuilder()
      .setCustomId("plName")
      .setLabel("플레이 리스트 이름을 입력하세요.")
      .setStyle(TextInputStyle.Short);
    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameINput
      );

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const submitted: ModalSubmitInteraction =
      await interaction.awaitModalSubmit({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      });

    if (submitted) {
    }
  },
};
