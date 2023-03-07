import { EcEvent } from "../../types/event";
import { slashCommandManager } from "./slashCommandManager";
import { messageCreate } from "./messageCreate";
import { helpCommandManager } from "./helpCommandManager";
import { raw } from "./raw";
import { fileCreate } from "./fileCreate";

export const allEvents: EcEvent[] = [
  slashCommandManager,
  helpCommandManager,
  messageCreate,
  raw,
  fileCreate,
];
