import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const skipCommand: EcCommand = {
  name: "스킵",
  description: "재생중인 곡을 스킵합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("스킵")
    .setDescription("재생중인 곡을 스킵합니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canSkip = await guildVoiceManager.check(interaction, guildId);
    if (canSkip) {
      await guildVoiceManager.skip(interaction);
    }
  },
};
