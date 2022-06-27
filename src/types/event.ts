import { Client, Interaction, Message } from "discord.js";

export interface EcEvent {
  name: string,
  once: boolean,
  execute(client: Client|Interaction|Message): void;
}