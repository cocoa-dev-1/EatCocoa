import { ChatInputCommandInteraction } from "discord.js";
import { DiscordColor } from "./discord";

export interface EcSendMessageOption {
  title: string;
  interaction: ChatInputCommandInteraction;
  msg?: string;
  color?: DiscordColor;
}
