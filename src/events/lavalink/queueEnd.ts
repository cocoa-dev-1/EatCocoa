import { ChannelType, EmbedBuilder, TextChannel } from "discord.js";
import { Player } from "erela.js";
import { client } from "../../bot";
import { EcLavaLink } from "../../types/event";
import { defaultFooter, defaultThumbnail } from "../../utils/asset";

export const queueEnd: EcLavaLink = {
  name: "queueEnd",
  once: false,
  async execute(player: Player) {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel.isTextBased()) {
      const embed = new EmbedBuilder({
        title: "노래를 모두 재생하였습니다.",
        thumbnail: defaultThumbnail,
        footer: defaultFooter,
        timestamp: Date.now(),
      });
      await channel.send({ embeds: [embed] });
    }
    player.destroy();
  },
};
