import { Player } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const playerCreate: EcLavaLink = {
  name: "playerCreate",
  once: false,
  async execute(player: Player) {
    logger.log(`Player has been created in ${player.guild}`);
  },
};
