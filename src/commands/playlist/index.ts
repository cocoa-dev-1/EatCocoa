import { EcCommand, EcPlCommand } from "../../types/command";
import { pladdCommand } from "./add";
import { plcreateCommand } from "./create";
import { plmainCommand } from "./main";

export const playlistCommands: EcCommand[] = [plmainCommand];

export const playlistSubCommands: EcPlCommand[] = [
  pladdCommand,
  plcreateCommand,
];

export const playlistSubCommandCollections = new Map<string, EcPlCommand>();
playlistSubCommands.forEach((plCommand) =>
  playlistSubCommandCollections.set(plCommand.name, plCommand)
);