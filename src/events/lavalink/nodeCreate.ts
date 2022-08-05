import { Node } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const nodeCreate: EcLavaLink = {
  name: "nodeCreate",
  once: false,
  async execute(node: Node) {
    logger.log(`Node "${node.options.identifier}" created.`);
  },
};
