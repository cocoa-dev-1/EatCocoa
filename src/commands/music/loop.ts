import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, Colors } from "discord.js";
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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("노래")
        .setDescription("현재 재생중인 노래를 반복재생/해제합니다.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("목록")
        .setDescription("현재 재생목록을 반복재생/해제합니다.")
    )
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
      const [type, result] = await guildVoiceManager.loop(interaction);
      const repeat = result ? "재생" : "해제";
      await guildVoiceManager.sendMessage(interaction, {
        title: `현재 ${type}을(를) 반복${repeat} 하였습니다.`,
      });
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
