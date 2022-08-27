import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  MessageActionRowComponentBuilder,
  MessageComponentInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import Container from "typedi";
import { EcPlCommand } from "../../types/command";
import { PlaylistManager } from "../../services/PlaylistManager";
import { winstonLogger } from "../../utils/winston";

export const plgetCommand: EcPlCommand = {
  name: "찾기",
  description: "플레이 리스트를 찾습니다.",
  async execute(interaction: SelectMenuInteraction) {
    const playlistManager = Container.get(PlaylistManager);
    const modal = new ModalBuilder()
      .setTitle("플레이 리스트를 찾습니다.")
      .setCustomId("plAdd");
    const playlistNameInput = new TextInputBuilder()
      .setCustomId("plName")
      .setLabel("플레이 리스트 이름을 입력하세요.")
      .setStyle(TextInputStyle.Short);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameInput
      );

    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);

    const submitted: ModalSubmitInteraction = await interaction
      .awaitModalSubmit({
        time: 60000,
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
      if ((await playlistManager.isExist(playlistName))) {
        const embeds = await playlistManager.createPlaylistEmbedList(
          playlistName
        );
        if (embeds.length > 0) {
          let page = 0;
          const last = new ButtonBuilder()
            .setCustomId("이전")
            .setDisabled(true)
            .setLabel("이전")
            .setStyle(ButtonStyle.Success);
          const next = new ButtonBuilder()
            .setCustomId("다음")
            .setLabel("다음")
            .setStyle(ButtonStyle.Success);
          if (page + 1 === embeds.length) next.setDisabled(true);
          const row =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              last,
              next
            );
          await submitted.reply({
            content: `**페이지: ${page + 1}/${embeds.length}**`,
            embeds: [embeds[0]],
            components: [row],
          });
          const collector =
            submitted.channel.createMessageComponentCollector<ComponentType.Button>();
          collector.on("collect", (i: MessageComponentInteraction) => {
            if (i.isButton()) {
              if (i.customId === "다음") {
                const nextPage = ++page;
                const currentPage = embeds[nextPage];
                if (!(page + 1 === embeds.length)) {
                  next.setDisabled(false);
                } else {
                  next.setDisabled(true);
                }
                if (page < 1) {
                  last.setDisabled(true);
                } else {
                  last.setDisabled(false);
                }
                const row =
                  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    last,
                    next
                  );
                i.update({
                  content: `**페이지: ${nextPage + 1}/${embeds.length}**`,
                  embeds: [currentPage],
                  components: [row],
                });
              } else if (i.customId === "이전") {
                const lastPage = --page;
                const currentPage = embeds[lastPage];
                if (!(page + 1 === embeds.length)) {
                  next.setDisabled(false);
                } else {
                  next.setDisabled(true);
                }
                if (page < 1) {
                  last.setDisabled(true);
                } else {
                  last.setDisabled(false);
                }
                const row =
                  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    last,
                    next
                  );
                i.update({
                  content: `**페이지: ${lastPage + 1}/${embeds.length}**`,
                  embeds: [currentPage],
                  components: [row],
                });
              }
            }
          });
        } else {
          await playlistManager.modalMessage(submitted, {
            title: "플레이 리스트에 노래가 없습니다.",
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
