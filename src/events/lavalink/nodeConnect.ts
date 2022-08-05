import { Node } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const nodeConnect: EcLavaLink = {
  name: "nodeConnect",
  once: false,
  async execute(node: Node) {
    logger.success(`Node "${node.options.identifier}" connected.`);
  },
};
