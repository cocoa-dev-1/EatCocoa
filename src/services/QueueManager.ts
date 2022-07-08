import { MessageEmbed } from "discord.js";
import { Service } from "typedi";
import { Player } from "../structures/Player";
import { EcCommandInteraction } from "../types/command";

@Service()
export class QueueManager {
  constructor() {}

  async createEmbedList(
    interaction: EcCommandInteraction,
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
      const embed = new MessageEmbed({
        title: "남은 노래 리스트",
        description: `**[현재 재생중: ${musicPlayer.current.title}](${musicPlayer.current.url})**\n${info}`,
      });
      embeds.push(embed);
    }
    return embeds;
  }

  checkNext(embedList: MessageEmbed[], page: number) {
    if (page === embedList.length) {
      return false;
    } else {
      return true;
    }
  }
  checkLast(embedList: MessageEmbed[], page: number) {
    if (page <= 1) {
      return false;
    } else {
      return true;
    }
  }
}
