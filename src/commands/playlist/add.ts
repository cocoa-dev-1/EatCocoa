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
import { CommandCategory, EcCommand, EcPlCommand } from "../../types/command";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";
import { winstonLogger } from "../../utils/winston";
import { defaultFooter } from "../../utils/asset";

export const pladdCommand: EcPlCommand = {
  name: "추가",
  description: "플레이 리스트에 노래를 추가합니다.",
  async execute(interaction: SelectMenuInteraction) {
    // await interaction.deferReply({ ephemeral: true });
    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const modal = new ModalBuilder()
      .setTitle("노래를 추가합니다.")
      .setCustomId("plAdd");
    const playlistNameInput = new TextInputBuilder()
      .setCustomId("plName")
      .setLabel("플레이 리스트 이름을 입력하세요.")
      .setStyle(TextInputStyle.Short);

    const urlInput = new TextInputBuilder()
      .setCustomId("plUrl")
      .setLabel("유튜브 링크를 입력하세요.")
      .setStyle(TextInputStyle.Short);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameInput
      );
    const secondActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        urlInput
      );

    modal.addComponents(firstActionRow, secondActionRow);

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
      const playlistName = submitted.fields.getTextInputValue("plName");
      if (playlistManager.isExist(playlistName)) {
        const url = submitted.fields.getTextInputValue("plUrl");
        const [result, type] = await guildVoiceManager.search(interaction, url);
        let isPlayList = false;
        if (type === "LOAD_FAILED") {
          await playlistManager.modalMessage(submitted, {
            title: "노래를 가져오지 못했습니다.",
            color: Colors.Red,
          });
          return;
        } else if (type === "NO_MATCHES") {
          await playlistManager.modalMessage(submitted, {
            title: "노래를 찾지 못했습니다.",
            color: Colors.Red,
          });
          return;
        } else if (type === "PLAYLIST_LOADED") {
          isPlayList = true;
        }
        const [playlist, isAdded, message] = await playlistManager.add(
          playlistName,
          result
        );
        if (isAdded) {
          let title = "";
          let description = "";
          let thumbnail = "";
          if (isPlayList) {
            title = "재생 목록이 추가되었습니다.";
            description = `이름: [${result.playlist.name}](${result.playlist.selectedTrack.uri})`;
            thumbnail = result.playlist.selectedTrack.thumbnail;
          } else {
            title = "노래가 추가되었습니다.";
            description = `이름: [${result.tracks[0].title}](${result.tracks[0].uri})`;
            thumbnail = result.tracks[0].thumbnail;
          }
          await playlistManager.modalMessage(submitted, {
            title: title,
            description: description,
            thumbnail: {
              url: thumbnail,
            },
            footer: {
              text: `플레이 리스트: ${playlist.name}`,
              iconURL: defaultFooter.iconURL,
            },
          });
        } else {
          await playlistManager.modalMessage(submitted, {
            title: message,
            color: Colors.Red,
          });
        }
      } else {
        await playlistManager.modalMessage(submitted, {
          title: "플레이 리스트가 존재하지 않습니다.",
          color: Colors.Red,
        });
      }
    }
  },
};
