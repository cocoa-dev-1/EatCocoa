import { Collection } from "discord.js";
import { Player } from "./Player";
import { createAudioPlayer } from "@discordjs/voice";

export class Manager {
  players: Collection<string, Player>;
  constructor() {
    this.players = new Collection<string, Player>();
  }

  async newPlayer(guildId: string): Promise<Player> | null {
    const player = new Player();
    this.players.set(guildId, player);
    return player;
  }

  async getPlayer(guildId: string): Promise<Player> | null {
    return this.players.get(guildId);
  }

  async hasPlayer(guildId: string): Promise<boolean> {
    const player = this.getPlayer(guildId);
    if (player) {
      return true;
    } else {
      return false;
    }
  }

  async removePlayer(guildId: string): Promise<boolean> {
    const player = this.getPlayer(guildId);
    if (player) {
      this.players.delete(guildId);
      return true;
    } else {
      return false;
    }
  }
}
