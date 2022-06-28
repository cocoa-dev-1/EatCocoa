import { EcEvent } from "../types/event";
import { slashCommandManager } from "./slashCommandManager";
import { messageCreate } from "./messageCreate";
import { helpCommandManager } from "./helpCommandManager";

export const allEvents: EcEvent[] = [
  slashCommandManager,
  helpCommandManager,
  messageCreate
]