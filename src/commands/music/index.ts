import { EcCommand } from "../../types/command";
import { pauseCommand } from "./pause";
import { playCommand } from "./play";
import { queueCommand } from "./queue";
import { skipCommand } from "./skip";

export const musicCommands: EcCommand[] = [
  playCommand,
  pauseCommand,
  queueCommand,
  skipCommand,
];
