import { EcLavaLink } from "../../types/event";
import { nodeConnect } from "./nodeConnect";
import { nodeCreate } from "./nodeCreate";
import { nodeDisconnect } from "./nodeDisconnect";
import { nodeError } from "./nodeError";
import { nodeReconnect } from "./nodeReconnect";
import { playerCreate } from "./playerCreate";
import { playerDestroy } from "./playerDestroy";
import { playerMove } from "./playerMove";
import { queueEnd } from "./queueEnd";
import { socketClosed } from "./socketClosed";
import { trackEnd } from "./trackEnd";
import { trackError } from "./trackError";
import { trackStart } from "./trackStart";
import { trackStuck } from "./trackStuck";

export const allLavaLinkEvents: EcLavaLink[] = [
  nodeConnect,
  nodeCreate,
  nodeDisconnect,
  nodeError,
  nodeReconnect,
  playerCreate,
  playerDestroy,
  playerMove,
  queueEnd,
  socketClosed,
  trackEnd,
  trackError,
  trackStart,
  trackStuck,
];
