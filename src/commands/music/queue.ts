import { SlashCommandBuilder } from "@discordjs/builders";
import {
  InteractionCollector,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { QueueManager } from "../../services/QueueManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const queueCommand: EcCommand = {
  name: "queue",
  description: "서버에서 재생중인 노래 목록을 가져옵니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("서버에서 재생중인 노래 목록을 가져옵니다.")
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const queueManager = Container.get(QueueManager);
    const musicPlayer = await guildVoiceManager.getPlayer(interaction, guildId);
    if (musicPlayer) {
      let page = 0;
      const embedList: MessageEmbed[] = await queueManager.createEmbedList(
        interaction,
        musicPlayer
      );
      const last = new MessageButton()
        .setCustomId("이전")
        .setDisabled(true)
        .setLabel("이전")
        .setStyle("SUCCESS");
      const next = new MessageButton()
        .setCustomId("다음")
        .setLabel("다음")
        .setStyle("SUCCESS");
      if (page + 1 === embedList.length) next.setDisabled(true);
      const row = new MessageActionRow().addComponents(last, next);
      await interaction.editReply({
        content: `**페이지: ${page + 1}/${embedList.length}**`,
        embeds: [embedList[0]],
        components: [row],
      });
      const collector =
        interaction.channel.createMessageComponentCollector<"BUTTON">();
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
            const row = new MessageActionRow().addComponents(last, next);
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
            const row = new MessageActionRow().addComponents(last, next);
            i.update({
              content: `**페이지: ${lastPage + 1}/${embedList.length}**`,
              embeds: [currentPage],
              components: [row],
            });
          }
        }
      });
    }
  },
};
