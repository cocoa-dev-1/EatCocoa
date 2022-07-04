import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const playCommand: EcCommand = {
  name: "play",
  description: "노래 재생하기",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) =>
      option.setName("url").setRequired(true).setDescription("노래의 URL")
    )
    .toJSON(),
  async execute(
    interaction: EcCommandInteraction,
    guildId: string
  ): Promise<void> {
    const url = interaction.options.get("url");
    if (url) {
      const { music } = interaction.client;
      let musicPlayer = music.getPlayer(guildId);
      if (!musicPlayer) {
        musicPlayer = music.newPlayer(guildId);
      }
    }
  },
};
