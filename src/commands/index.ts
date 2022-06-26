import { EcCommand } from "../types/command";
import { comunityCommands } from "./comunity";
import { musicCommands } from "./music";

export const allCommands: EcCommand[] = [
  ...comunityCommands,
  ...musicCommands
]