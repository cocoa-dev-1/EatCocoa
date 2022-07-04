import { SelectMenuInteraction } from "discord.js";
import Container from "typedi";
import { HelpManager } from "../services/helpManager";
import { EcEvent } from "../types/event";

export const helpCommandManager: EcEvent = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: SelectMenuInteraction) {
    if (interaction.isSelectMenu()) {
      if (interaction.customId === "도움말") {
        await Container.get(HelpManager).updateHelpMessage(interaction);
      }
    }
  },
};
