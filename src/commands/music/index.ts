import { EcCommand } from "../../types/command";
import { loopCommand } from "./loop";
import { pauseCommand } from "./pause";
import { playCommand } from "./play";
import { queueCommand } from "./queue";
import { searchCommand } from "./search";
import { skipCommand } from "./skip";
import { stopCommand } from "./stop";

export const musicCommands: EcCommand[] = [
  playCommand,
  pauseCommand,
  queueCommand,
  skipCommand,
  searchCommand,
  loopCommand,
  stopCommand,
];
