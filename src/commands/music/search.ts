import { SlashCommandBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  Interaction,
  InteractionCollector,
  Message,
  MessageActionRowComponent,
  MessageComponentInteraction,
  SelectMenuBuilder,
  SelectMenuComponent,
  SelectMenuInteraction,
} from "discord.js";
import { Player, Track } from "erela.js";
import Container from "typedi";
import { manager } from "../../loader/managerLoader";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { CommandCategory, EcCommand } from "../../types/command";
import { createEmbed } from "../../utils/embed";
import { playCommand } from "./play";

export const searchCommand: EcCommand = {
  name: "검색",
  description: "유튜브에서 노래를 찾습니다.",
  category: CommandCategory.get("MUSIC").value,
  data: new SlashCommandBuilder()
    .setName("검색")
    .setDescription("유튜브에서 노래를 찾습니다.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("찾을 노래를 입력하세요")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction, guildId: string) {
    await interaction.deferReply();
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const [check, message] = await guildVoiceManager.check(interaction, {
      inVoiceChannel: true,
      inSameChannel: true,
    });
    if (check) {
      const song = interaction.options.getString("song");
      const [result, type] = await guildVoiceManager.search(interaction, song);
      if (type === "LOAD_FAILED") {
        await guildVoiceManager.sendMessage(interaction, {
          title: "노래를 가져오지 못했습니다.",
          color: Colors.Red,
        });
        return;
      } else if (type === "NO_MATCHES") {
        await guildVoiceManager.sendMessage(interaction, {
          title: "노래를 찾지 못했습니다.",
          color: Colors.Red,
        });
        return;
      } else if (type === "PLAYLIST_LOADED") {
        await guildVoiceManager.sendMessage(interaction, {
          title: "유튜브 플레이 리스트는 지원하지 않습니다.",
          color: Colors.Red,
        });
        return;
      }
      const songSelectList = guildVoiceManager.createSongSelectList(
        result.tracks
      );
      const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
        new SelectMenuBuilder()
          .setCustomId("search")
          .setPlaceholder("노래를 선택하세요")
          .addOptions(songSelectList)
      );
      const songEmbed = createEmbed({
        title: "노래를 선택하세요",
        description: "30초 안에 선택해야합니다",
      });
      await interaction.editReply({
        embeds: [songEmbed],
        components: [row],
      });
      const collector =
        interaction.channel.createMessageComponentCollector<ComponentType.SelectMenu>(
          {
            time: 30000,
          }
        );
      collector.on("collect", async (i: MessageComponentInteraction) => {
        if (i.customId === "search" && i.isSelectMenu()) {
          const selectedOption = i.values[0];
          const [result, type] = await guildVoiceManager.search(
            interaction,
            selectedOption
          );
          const isExist = guildVoiceManager.isExist(interaction);
          const userVoiceChannel =
            guildVoiceManager.getUserVoiceChannel(interaction);
          let player: Player = null;
          if (isExist) player = manager.get(interaction.guild.id);
          else {
            player = manager.create({
              guild: interaction.guild.id,
              voiceChannel: userVoiceChannel.id,
              textChannel: interaction.channel.id,
              volume: 50,
              selfDeafen: true,
            });
            player.connect();
          }
          player.queue.add(result.tracks[0]);
          const embed = createEmbed({
            title: "노래가 추가되었습니다.",
            description: `[${result.tracks[0].title}](${result.tracks[0].uri})`,
            thumbnail: {
              url: result.tracks[0].thumbnail,
            },
          });
          await i.update({
            embeds: [embed],
            components: [],
          });
          if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
          }
          collector.stop();
        }
      });
    } else {
      await guildVoiceManager.sendMessage(interaction, {
        title: message,
        color: Colors.Red,
      });
    }
  },
};
