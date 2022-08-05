import { Player } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const playerDestroy: EcLavaLink = {
  name: "playerDestroy",
  once: false,
  async execute(player: Player) {
    logger.log(`Player has been destroyed in ${player.guild}`);
  },
};
