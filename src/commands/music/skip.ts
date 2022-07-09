import { SlashCommandBuilder } from "@discordjs/builders";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const skipCommand: EcCommand = {
  name: "스킵",
  description: "재생중인 곡을 스킵합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("스킵")
    .setDescription("재생중인 곡을 스킵합니다.")
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canSkip = await guildVoiceManager.check(interaction, guildId);
    if (canSkip) {
      await guildVoiceManager.skip(interaction);
    }
  },
};
