import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Service } from "typedi";
import { Player } from "../structures/Player";

@Service()
export class QueueManager {
  constructor() {}

  async createEmbedList(
    interaction: ChatInputCommandInteraction,
    musicPlayer: Player
  ) {
    const queue = musicPlayer.getRemainingQueue();
    let embeds = [];
    let k = 10;
    for (let i = 0; i < queue.length; i += 10) {
      const currentPage = queue.slice(i, k);
      let j = i;
      k += 10;
      const info = currentPage
        .map((track) => {
          return `${++j}) [${track.title}](${track.url})`;
        })
        .join("\n");
      const embed = new EmbedBuilder({
        title: "남은 노래 리스트",
        description: `**[현재 재생중: ${musicPlayer.current.title}](${musicPlayer.current.url})**\n${info}`,
      });
      embeds.push(embed);
    }
    return embeds;
  }

  checkNext(embedList: EmbedBuilder[], page: number) {
    if (page === embedList.length) {
      return false;
    } else {
      return true;
    }
  }
  checkLast(embedList: EmbedBuilder[], page: number) {
    if (page <= 1) {
      return false;
    } else {
      return true;
    }
  }
}
