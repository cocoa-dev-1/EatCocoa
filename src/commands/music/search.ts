import { SlashCommandBuilder } from "@discordjs/builders";
import {
  Interaction,
  InteractionCollector,
  Message,
  MessageComponentInteraction,
  SelectMenuInteraction,
} from "discord.js";
import Container from "typedi";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import {
  CommandCategory,
  EcCommand,
  EcCommandInteraction,
} from "../../types/command";
import { playCommand } from "./play";

export const searchCommand: EcCommand = {
  name: "search",
  description: "유튜브에서 노래를 찾습니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("유튜브에서 노래를 찾습니다.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("찾을 노래를 입력하세요")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: EcCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const canSearch = await guildVoiceManager.check(interaction, guildId);
    if (canSearch) {
      await guildVoiceManager.search(interaction);
      const collector =
        interaction.channel.createMessageComponentCollector<"ACTION_ROW">({
          time: 30000,
        });
      collector.on("collect", async (i: MessageComponentInteraction) => {
        if (i.customId === "search" && i.isSelectMenu()) {
          await i.update({
            components: [],
          });
          const selectedOption = i.values[0];
          const musicPlayer = await guildVoiceManager.getPlayer(
            interaction,
            guildId,
            true
          );
          await guildVoiceManager.play(
            interaction,
            musicPlayer,
            selectedOption
          );
          collector.stop();
        }
      });
    }
  },
};
