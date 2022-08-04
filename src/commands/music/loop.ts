import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const loopCommand: EcCommand = {
  name: "반복",
  description: "현재 플레이 리스트를 반복재생/해제 합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("반복")
    .setDescription("현재 플레이 리스트를 반복재생/해제 합니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canLoop = await guildVoiceManager.check(interaction, guildId);
    if (canLoop) {
      await guildVoiceManager.loop(interaction);
    }
  },
};
