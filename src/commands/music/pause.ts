import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const pauseCommand: EcCommand = {
  name: "일시정지",
  description: "노래를 일시정지/재생 합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("일시정지")
    .setDescription("노래를 일시정지/재생 합니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canPause = await guildVoiceManager.check(interaction, guildId);
    if (canPause) {
      await guildVoiceManager.pause(interaction);
    }
  },
};
