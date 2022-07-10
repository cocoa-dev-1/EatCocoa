import { EcCommandInteraction } from "./command";
import { DiscordColor } from "./discord";

export interface EcSendMessageOption {
  title: string;
  interaction: EcCommandInteraction;
  msg?: string;
  color?: DiscordColor;
}
