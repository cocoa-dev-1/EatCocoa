import { ChannelType, Colors, EmbedBuilder, TextChannel } from "discord.js";
import { Player, Track, TrackExceptionEvent } from "erela.js";
import { client } from "../../bot";
import { EcLavaLink } from "../../types/event";
import { defaultFooter, defaultThumbnail } from "../../utils/asset";
import { logger } from "../../utils/logger";
import { winstonLogger } from "../../utils/winston";

export const trackError: EcLavaLink = {
  name: "trackError",
  once: false,
  async execute(player: Player, track: Track, payload: TrackExceptionEvent) {
    winstonLogger.error(payload.error);
    const channel = client.channels.cache.get(player.textChannel);
    if (channel.isTextBased()) {
      const embed = new EmbedBuilder({
        title: "노래를 가져오던중 에러가 발생하였습니다.",
        color: Colors.Red,
        thumbnail: defaultThumbnail,
        footer: defaultFooter,
        timestamp: Date.now(),
      });
      await channel.send({ embeds: [embed] });
    }
    logger.error(
      `Error when loading song! Track is error in [${player.guild}]`
    );
    if (!player.voiceChannel) player.destroy();
  },
};
