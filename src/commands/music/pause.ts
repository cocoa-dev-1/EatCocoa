import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Colors } from "discord.js";
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
    const [check, message] = await guildVoiceManager.check(interaction, {
      inSameChannel: true,
      inVoiceChannel: true,
      isPlayerExist: true,
    });
    if (check) {
      const result = await guildVoiceManager.pause(interaction);
      const paused = result ? "일시정지" : "재생";
      await guildVoiceManager.sendMessage(interaction, {
        title: `노래를 ${paused} 합니다.`,
      });
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
