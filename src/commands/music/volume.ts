import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const volumeCommand: EcCommand = {
  name: "음량",
  description: "노래의 음량을 조절합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("음량")
    .setDescription("노래의 음량을 조절합니다.")
    .addIntegerOption((option) =>
      option
        .setName("음량")
        .setDescription("1~100까지 볼륨을 설정하세요.")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
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
      const result = await guildVoiceManager.setVolume(interaction);
      await guildVoiceManager.sendMessage(interaction, {
        title: `볼륨이 **${result}%**로 설정되었습니다.`,
      });
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
