import { Player } from "erela.js";
import { client } from "../../bot";
import { EcLavaLink } from "../../types/event";

export const playerMove: EcLavaLink = {
  name: "playerMove",
  once: false,
  async execute(player: Player, oldChannel: string, newChannel: string) {
    const channel = client.channels.cache.get(newChannel);
    if (channel) player.voiceChannel = channel.id;
  },
};
