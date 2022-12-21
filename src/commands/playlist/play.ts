import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import { Player, Track } from "erela.js";
import Container from "typedi";
import { manager } from "../../loader/managerLoader";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";
import { TrackManager } from "../../services/TrackManager";
import { CommandCategory, EcCommand } from "../../types/command";

export const plplayCommand: EcCommand = {
  name: "로드",
  description: "플레이 리스트를 재생합니다.",
  category: CommandCategory.get("PLAYLIST").value,
  data: new SlashCommandBuilder()
    .setName("로드")
    .setDescription("플레이 리스트를 재생합니다.")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("플레이 리스트")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .toJSON(),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const trackManager = Container.get(TrackManager);
    const plName = interaction.options.getString("playlist");
    const isExist = await playlistManager.isExist(plName);
    if (isExist) {
      const [check, message] = await guildVoiceManager.check(interaction, {
        inVoiceChannel: true,
        inSameChannel: true,
      });
      if (check) {
        const playlist = await playlistManager.get(plName);
        const tracks = await playlistManager.getPlaylistTracks(playlist);
        const laTracks: Track[] = [];
        for (let track of tracks) {
          const laTrack = await trackManager.toLaTrack(
            track,
            interaction.member
          );
          laTracks.push(laTrack);
        }

        if (laTracks.length == 0) {
          return await playlistManager.sendMessage(interaction, {
            title: "플레이 리스트가 비어있습니다.",
            color: Colors.Red,
          });
        }
        const isExist = guildVoiceManager.isExist(interaction);
        let player: Player = null;

        if (isExist) {
          player = manager.get(interaction.guild.id);
        } else {
          const userVoiceChannel =
            guildVoiceManager.getUserVoiceChannel(interaction);

          player = manager.create({
            guild: interaction.guild.id,
            voiceChannel: userVoiceChannel.id,
            textChannel: interaction.channel.id,
            volume: 50,
            selfDeafen: true,
          });
          player.connect();
        }

        player.queue.add(laTracks);

        if (!player.playing && !player.paused) {
          await player.play();
        }

        await playlistManager.sendMessage(interaction, {
          title: "플레이 리스트가 추가되었습니다.",
          description: playlist.name,
          thumbnail: {
            url: laTracks[0].thumbnail,
          },
          footer: {
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL(),
          },
        });
      } else {
        await playlistManager.sendMessage(interaction, {
          title: message,
          color: Colors.Red,
        });
      }
    } else {
      await playlistManager.sendMessage(interaction, {
        title: "플레이 리스트가 없습니다.",
        color: Colors.Red,
      });
    }
  },
};
