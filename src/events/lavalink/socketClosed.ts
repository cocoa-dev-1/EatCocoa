import { Payload, Player, WebSocketClosedEvent } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const socketClosed: EcLavaLink = {
  name: "socketClosed",
  once: false,
  async execute(player: Player, payload: WebSocketClosedEvent) {
    if (payload.byRemote == true) {
      player.destroy();
    }
    logger.log(
      `Socket has been closed because ${payload.reason} in [${player.guild}]`
    );
  },
};
