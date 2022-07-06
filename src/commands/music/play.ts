import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Container } from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
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
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const url = interaction.options.getString("url");
    if (url) {
      const canPlay = await guildVoiceManager.check(interaction, guildId);
      if (canPlay) {
        const musicPlayer = await guildVoiceManager.getPlayer(
          interaction,
          guildId,
          true
        );
        await guildVoiceManager.play(interaction, musicPlayer, url);
      }
    } else {
      guildVoiceManager.Error(interaction, "url을 찾지 못했습니다.");
    }
  },
};
