import { SlashCommandBuilder } from "@discordjs/builders";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const stopCommand: EcCommand = {
  name: "종료",
  description: "노래를 완전히 종료합니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("종료")
    .setDescription("노래를 완전히 종료합니다.")
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canStop = guildVoiceManager.check(interaction, guildId);
    if (canStop) {
      const musicPlayer = await guildVoiceManager.getPlayer(
        interaction,
        guildId
      );
      if (musicPlayer) {
        await guildVoiceManager.stop(interaction, musicPlayer);
      } else {
        await guildVoiceManager.Error(interaction, "재생중인 노래가 없습니다.");
      }
    }
  },
};
