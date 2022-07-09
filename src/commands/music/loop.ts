import { SlashCommandBuilder } from "@discordjs/builders";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const loopCommand: EcCommand = {
  name: "반복",
  description: "현재 플레이 리스트를 반복재생/해제 합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("반복")
    .setDescription("현재 플레이 리스트를 반복재생/해제 합니다.")
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canLoop = await guildVoiceManager.check(interaction, guildId);
    if (canLoop) {
      await guildVoiceManager.loop(interaction);
    }
  },
};
