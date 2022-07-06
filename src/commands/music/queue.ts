import { SlashCommandBuilder } from "@discordjs/builders";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";

export const queueCommand: EcCommand = {
  name: "queue",
  description: "서버에서 재생중인 노래 목록을 가져옵니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("서버에서 재생중인 노래 목록을 가져옵니다.")
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    const guildVoiceManager = Container.get(GuildVoiceManager);
  },
};
