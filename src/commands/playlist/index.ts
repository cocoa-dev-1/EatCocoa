import { EcCommand, EcPlCommand } from "../../types/command";
import { plcreateCommand } from "./create";
import { pldeleteCommand } from "./delete";
import { plplaylistCommand } from "./playlist";
// import { pladdCommand } from "./old/add";
// import { plcreateCommand } from "./old/create";
// import { plgetCommand } from "./old/get";
// import { plmainCommand } from "./old/main";
// import { plplayCommand } from "./old/play";

// export const playlistCommands: EcCommand[] = [plmainCommand];

// export const playlistSubCommands: EcPlCommand[] = [
//   plcreateCommand,
//   pladdCommand,
//   plgetCommand,
//   plplayCommand,
// ];

// export const playlistSubCommandCollections = new Map<string, EcPlCommand>();
// playlistSubCommands.forEach((plCommand) =>
//   playlistSubCommandCollections.set(plCommand.name, plCommand)
// );

export const playlistCommands: EcCommand[] = [
  plcreateCommand,
  pldeleteCommand,
  plplaylistCommand,
];
