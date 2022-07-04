import { EcCommandInteraction } from "../types/command";
import { PlayerOption } from "../types/player";
import { VoiceBasedChannel } from "discord.js";
import { Item } from "ytpl";

export class Player {
  private queue: Item[];
  public playing: boolean;
  public currentChannel: string;
  public current: Item;

  constructor(option?: PlayerOption) {
    this.queue = [];
    this.playing = option?.playing || false;
    this.currentChannel = option?.currentChannel || null;
    this.current = null;
  }

  async play() {}

  async connect(channel: VoiceBasedChannel) {}

  async add(video: Item) {
    this.queue.push(video);
  }
}
