import { EmbedBuilder } from "discord.js";
import { Player } from "erela.js";
import { client } from "../../bot";
import { EcLavaLink } from "../../types/event";
import { defaultFooter, defaultThumbnail } from "../../utils/asset";
import { logger } from "../../utils/logger";

export const playerDestroy: EcLavaLink = {
  name: "playerDestroy",
  once: false,
  async execute(player: Player) {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel.isTextBased()) {
      const embed = new EmbedBuilder({
        title: "재생을 종료합니다.",
        footer: defaultFooter,
        timestamp: Date.now(),
      });
      await channel.send({ embeds: [embed] });
    }
    logger.log(`Player has been destroyed in ${player.guild}`);
  },
};
