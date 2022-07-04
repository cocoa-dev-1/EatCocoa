import { banCommand } from "./ban";
import { EcCommand } from "../../types/command";
import { unbanCommand } from "./unban";

export const adminCommands: EcCommand[] = [banCommand, unbanCommand];
