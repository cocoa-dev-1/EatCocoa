import { EcEvent } from "../types/event";
import { interactionCreate } from "./interactionCreate";
import { messageCreate } from "./messageCreate";

export const allEvents: EcEvent[] = [
  interactionCreate,
  messageCreate
]