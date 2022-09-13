import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { createEmbed } from "./embed";

export const paginate = async (
  interaction: ChatInputCommandInteraction,
  embeds: EmbedBuilder[],
  timeout?: number
): Promise<void> => {
  if (embeds.length < 2) {
    await interaction.editReply({ embeds: embeds });
    return;
  }
  let page = 0;

  const buttons =
    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setLabel("이전")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("다음")
        .setStyle(ButtonStyle.Primary)
    );
  await interaction.editReply({
    embeds: [embeds[page]],
    components: [buttons],
  });

  const collector =
    interaction.channel.createMessageComponentCollector<ComponentType.Button>({
      time: timeout ? timeout : 300000,
    });
  collector.on("collect", async (i) => {
    if (i.customId === "back") {
      if (page === 0) page = embeds.length - 1;
      else page--;
    } else if (i.customId === "next") {
      if (page == embeds.length - 1) page = 0;
      else page++;
    }
    await i.update({
      embeds: [embeds[page]],
    });
  });

  collector.on("end", async () => {
    await interaction.editReply({
      components: [],
    });
  });
};
