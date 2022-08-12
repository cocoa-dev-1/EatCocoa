import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  InteractionCollector,
  ActionRowBuilder,
  MessageComponentInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  ChatInputCommandInteraction,
  Colors,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const queueCommand: EcCommand = {
  name: "노래목록",
  description: "서버에서 재생중인 노래 목록을 가져옵니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("노래목록")
    .setDescription("서버에서 재생중인 노래 목록을 가져옵니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const [check, message] = await guildVoiceManager.check(interaction, {
      isPlayerExist: true,
    });
    if (check) {
      let page = 0;
      const queueEmbedList: EmbedBuilder[] =
        guildVoiceManager.createQueueEmbedList(interaction);
      if (queueEmbedList.length === 0) {
        await guildVoiceManager.sendMessage(interaction, {
          title: "남아있는 노래가 없습니다.",
          color: Colors.Red,
        });
        return;
      }
      const last = new ButtonBuilder()
        .setCustomId("이전")
        .setDisabled(true)
        .setLabel("이전")
        .setStyle(ButtonStyle.Success);
      const next = new ButtonBuilder()
        .setCustomId("다음")
        .setLabel("다음")
        .setStyle(ButtonStyle.Success);
      if (page + 1 === queueEmbedList.length) next.setDisabled(true);
      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          last,
          next
        );
      await interaction.editReply({
        content: `**페이지: ${page + 1}/${queueEmbedList.length}**`,
        embeds: [queueEmbedList[0]],
        components: [row],
      });
      const collector =
        interaction.channel.createMessageComponentCollector<ComponentType.Button>();
      collector.on("collect", (i: MessageComponentInteraction) => {
        if (i.isButton()) {
          if (i.customId === "다음") {
            const nextPage = ++page;
            const currentPage = queueEmbedList[nextPage];
            if (nextPage + 1 >= queueEmbedList.length) {
              next.setDisabled(true);
            } else {
              next.setDisabled(false);
            }
            if (nextPage <= 0) {
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
              content: `**페이지: ${nextPage + 1}/${queueEmbedList.length}**`,
              embeds: [currentPage],
              components: [row],
            });
          } else if (i.customId === "이전") {
            const lastPage = --page;
            const currentPage = queueEmbedList[lastPage];
            if (lastPage + 1 >= queueEmbedList.length) {
              next.setDisabled(true);
            } else {
              next.setDisabled(false);
            }
            if (lastPage <= 0) {
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
              content: `**페이지: ${lastPage + 1}/${queueEmbedList.length}**`,
              embeds: [currentPage],
              components: [row],
            });
          }
        }
      });
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
