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
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { QueueManager } from "../../services/QueueManager";
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
    const queueManager = Container.get(QueueManager);
    const musicPlayer = await guildVoiceManager.getPlayer(interaction, guildId);
    if (musicPlayer) {
      let page = 0;
      const embedList: EmbedBuilder[] = await queueManager.createEmbedList(
        interaction,
        musicPlayer
      );
      const last = new ButtonBuilder()
        .setCustomId("이전")
        .setDisabled(true)
        .setLabel("이전")
        .setStyle(ButtonStyle.Success);
      const next = new ButtonBuilder()
        .setCustomId("다음")
        .setLabel("다음")
        .setStyle(ButtonStyle.Success);
      if (page + 1 === embedList.length) next.setDisabled(true);
      const row =
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          last,
          next
        );
      await interaction.editReply({
        content: `**페이지: ${page + 1}/${embedList.length}**`,
        embeds: [embedList[0]],
        components: [row],
      });
      const collector =
        interaction.channel.createMessageComponentCollector<ComponentType.Button>();
      collector.on("collect", (i: MessageComponentInteraction) => {
        if (i.isButton()) {
          if (i.customId === "다음") {
            const nextPage = ++page;
            const currentPage = embedList[nextPage];
            if (queueManager.checkNext(embedList, nextPage + 1)) {
              next.setDisabled(false);
            } else {
              next.setDisabled(true);
            }
            if (queueManager.checkLast(embedList, nextPage + 1)) {
              last.setDisabled(false);
            } else {
              last.setDisabled(true);
            }
            const row =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                last,
                next
              );
            i.update({
              content: `**페이지: ${nextPage + 1}/${embedList.length}**`,
              embeds: [currentPage],
              components: [row],
            });
          } else if (i.customId === "이전") {
            const lastPage = --page;
            const currentPage = embedList[lastPage];
            if (queueManager.checkNext(embedList, lastPage + 1)) {
              next.setDisabled(false);
            } else {
              next.setDisabled(true);
            }
            if (queueManager.checkLast(embedList, lastPage + 1)) {
              last.setDisabled(false);
            } else {
              last.setDisabled(true);
            }
            const row =
              new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                last,
                next
              );
            i.update({
              content: `**페이지: ${lastPage + 1}/${embedList.length}**`,
              embeds: [currentPage],
              components: [row],
            });
          }
        }
      });
    } else {
      guildVoiceManager.Error(interaction, "재생중인 노래가 없습니다.");
    }
  },
};
