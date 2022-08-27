import {
  ActionRowBuilder,
  Colors,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  SelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Player, Track } from "erela.js";
import Container from "typedi";
import { manager } from "../../loader/managerLoader";
import { GuildVoiceManager } from "../../services/GuildVoiceManager";
import { PlaylistManager } from "../../services/PlaylistManager";
import { TrackManager } from "../../services/TrackManager";
import { EcPlCommand } from "../../types/command";
import { winstonLogger } from "../../utils/winston";

export const plplayCommand: EcPlCommand = {
  name: "재생",
  description: "플레이 리스트를 재생합니다.",
  async execute(interaction: SelectMenuInteraction) {
    const playlistManager = Container.get(PlaylistManager);
    const guildVoiceManager = Container.get(GuildVoiceManager);
    const trackManager = Container.get(TrackManager);
    const modal = new ModalBuilder()
      .setTitle("플레이 리스트를 재생합니다.")
      .setCustomId("plPlay");
    const playlistNameInput = new TextInputBuilder()
      .setCustomId("plName")
      .setLabel("플레이 리스트 이름을 입력하세요.")
      .setStyle(TextInputStyle.Short);

    const firstActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        playlistNameInput
      );

    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);

    const submitted: ModalSubmitInteraction = await interaction
      .awaitModalSubmit({
        time: 60000,
        filter: (i) => i.user.id === interaction.user.id,
      })
      .catch((error) => {
        // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
        console.error(error);
        winstonLogger.error(error);
        return null;
      });

    if (submitted) {
      const playlistName = submitted.fields.getTextInputValue("plName");
      if ((await playlistManager.isExist(playlistName))) {
        const [check, message] = await guildVoiceManager.check(submitted, {
          inSameChannel: true,
          inVoiceChannel: true,
        });
        if (check) {
          const playlist = await playlistManager.get(playlistName);
          const plTracks = await playlistManager.getPlaylistTracks(playlist);
          const laTracks: Track[] = [];
          for (let track of plTracks) {
            const laTrack = await trackManager.toLaTrack(
              track,
              submitted.member
            );
            laTracks.push(laTrack);
          }
          const isExist = guildVoiceManager.isExist(submitted);
          let player: Player = null;

          if (isExist) {
            player = manager.get(interaction.guild.id);
          } else {
            const userVoiceChannel =
              guildVoiceManager.getUserVoiceChannel(submitted);
            player = manager.create({
              guild: submitted.guild.id,
              voiceChannel: userVoiceChannel.id,
              textChannel: submitted.channel.id,
              volume: 50,
              selfDeafen: true,
            });
            player.connect();
          }
          player.queue.add(laTracks);

          if (!player.playing && !player.paused) {
            player.play();
          }

          await playlistManager.modalMessage(submitted, {
            title: "플레이 리스트가 추가되었습니다.",
            description: playlist.name,
            thumbnail: {
              url: laTracks[0].thumbnail,
            },
            footer: {
              text: submitted.user.tag,
              iconURL: submitted.user.avatarURL(),
            },
          });
        } else {
          await playlistManager.modalMessage(submitted, {
            title: message,
            color: Colors.Red,
          });
        }
      } else {
        await playlistManager.modalMessage(submitted, {
          title: "존재하지 않는 플레이 리스트 입니다.",
          color: Colors.Red,
        });
      }
    }
  },
};
