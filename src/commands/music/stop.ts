import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Colors } from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const stopCommand: EcCommand = {
  name: "종료",
  description: "노래를 완전히 종료합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("종료")
    .setDescription("노래를 완전히 종료합니다.")
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const [check, message] = await guildVoiceManager.check(interaction, {
      inVoiceChannel: true,
      inSameChannel: true,
      isPlayerExist: true,
    });
    if (check) {
      const result = await guildVoiceManager.stop(interaction);
      if (result) {
        await guildVoiceManager.sendMessage(interaction, {
          title: "노래 재생을 종료하였습니다.",
        });
      } else {
        await guildVoiceManager.sendMessage(interaction, {
          title: "노래 재생을 종료하던중 에러가 발생하였습니다.",
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
