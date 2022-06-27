import { Collection } from "discord.js";
import { EcCommand } from "../types/command";
import { comunityCommands } from "./comunity";
import { musicCommands } from "./music";

export const allCommands: EcCommand[] = [
  ...comunityCommands,
  ...musicCommands
]

export const commandCollection = new Collection<string, EcCommand>();

allCommands.forEach((command) => {
  commandCollection.set(command.name, command);
});