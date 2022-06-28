import { banCommand } from "./ban";
import { EcCommand } from "../../types/command";
import { unbanCommand } from "./unban";

export const comunityCommands: EcCommand[] = [
  banCommand,
  unbanCommand
]