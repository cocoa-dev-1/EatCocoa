import { Node } from "erela.js";
import { EcLavaLink } from "../../types/event";
import { logger } from "../../utils/logger";

export const nodeDisconnect: EcLavaLink = {
  name: "nodeDisconnect",
  once: false,
  async execute(node: Node, { reason }: { reason?: string }) {
    logger.log(
      `Node "${node.options.identifier}" disconnect because ${reason}.`
    );
  },
};
