import { Client } from "discord.js";

export interface EcEvent {
  name: string,
  once: boolean,
  execute(client: Client): void;
}