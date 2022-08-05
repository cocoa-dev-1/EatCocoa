import { Node } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const nodeError: EcLavaLink = {
  name: "nodeError",
  once: false,
  async execute(node: Node, error: Error) {
    logger.error(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    );
  },
};
