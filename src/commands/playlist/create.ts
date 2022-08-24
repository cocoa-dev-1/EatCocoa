import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import Container from "typedi";
import { PlaylistManager } from "../../services/PlaylistManager";
import { CommandCategory, EcCommand, EcPlCommand } from "../../types/command";
import { winstonLogger } from "../../utils/winston";

export const plcreateCommand: EcPlCommand = {
  name: "생성",
  description: "플레이 리스트를 생성합니다.",
  async execute(interaction: SelectMenuInteraction) {
    // await interaction.deferReply({ ephemeral: true });
    const playlistManager = Container.get(PlaylistManager);
    const modal = new ModalBuilder()
      .setTitle("플레이 리스트를 생성합니다.")
      .setCustomId("plCreate");
    const playlistNameInput = new TextInputBuilder()
      .setCustomId("plName")
      .setLabel("플레이 리스트 이름을 입력하세요.")
      .setStyle(TextInputStyle.Short);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameInput
      );

    modal.addComponents(firstActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);

    const submitted: ModalSubmitInteraction = await interaction
      .awaitModalSubmit({
        // Timeout after a minute of not receiving any valid Modals
        time: 60000,
        // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((error) => {
        // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
        console.error(error);
        winstonLogger.error(error);
        return null;
      });
    if (submitted) {
      const plName = submitted.fields.getTextInputValue("plName");
      const isExist = await playlistManager.isExist(plName);
      if (!isExist) {
        const result = await playlistManager.create(
          plName,
          interaction.member.user.id
        );
        if (result) {
          await playlistManager.modalMessage(submitted, {
            title: "플레이 리스트가 생성되었습니다.",
            description: `이름: **${result.name}**`,
          });
        } else {
          await playlistManager.modalMessage(submitted, {
            title: "플레이 리스트 생성도중 오류가 발생하였습니다.",
            color: Colors.Red,
          });
        }
      } else {
        await playlistManager.modalMessage(submitted, {
          title: "같은 이름을 가진 플레이 리스트가 존재합니다.",
          color: Colors.Red,
        });
      }
    }
  },
};
