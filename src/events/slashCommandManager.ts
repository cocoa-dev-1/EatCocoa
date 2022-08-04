import { Interaction } from "discord.js";
import { commandCollection } from "../commands";
import { EcEvent } from "../types/event";
import { logger } from "../utils/logger";
import { winstonLogger } from "../utils/winston";

export const slashCommandManager: EcEvent = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = commandCollection.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, interaction.guildId);
      } catch (error) {
        console.log(error);
        winstonLogger.error(error);
        logger.error("Error while executing command: " + command.name);
        await interaction.editReply({
          content: "Error while executing command: " + command.name,
          embeds: [],
          components: [],
        });
      }
    }
  },
};
