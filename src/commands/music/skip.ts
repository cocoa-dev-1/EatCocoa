import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Colors } from "discord.js";
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
    const [check, message] = await guildVoiceManager.check(interaction, {
      inSameChannel: true,
      inVoiceChannel: true,
      isPlayerExist: true,
    });
    if (check) {
      const result = await guildVoiceManager.skip(interaction);
      if (result) {
        await guildVoiceManager.sendMessage(interaction, {
          title: "현재 재생중인 노래를 스킵하였습니다.",
        });
      } else {
        await guildVoiceManager.sendMessage(interaction, {
          title: "노래를 스킵하던중 오류가 발생하였습니다.",
          color: Colors.Red,
        });
      }
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
