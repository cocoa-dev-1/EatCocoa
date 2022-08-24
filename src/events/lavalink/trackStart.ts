import {
  ChannelType,
  EmbedBuilder,
  GuildMember,
  TextChannel,
  User,
} from "discord.js";
import { Player, Track } from "erela.js";
import { client } from "../../bot";
import { EcLavaLink } from "../../types/event";
import { defaultFooter, defaultImage } from "../../utils/asset";

export const trackStart: EcLavaLink = {
  name: "trackStart",
  once: false,
  async execute(player: Player, track: Track) {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel.isTextBased()) {
      const embed = new EmbedBuilder({
        title: "노래를 재생합니다.",
        description: `[${track.title}](${track.uri})`,
        thumbnail: {
          url: track.thumbnail,
        },
        footer: {
          text: (track.requester as GuildMember).user.tag,
          icon_url: (track.requester as GuildMember).user.avatarURL(),
        },
        timestamp: Date.now(),
      });
      await channel.send({
        embeds: [embed],
      });
    }
  },
};
