import ytpl, { Item, Result } from "ytpl";
import ytdl, { VideoDetails } from "ytdl-core";
import ytsr, { Item as SrItem } from "ytsr";
import {
  GuildTextBasedChannel,
  TextChannel,
  VoiceBasedChannel,
} from "discord.js";

export interface PlayerOption {
  playing?: boolean;
  voiceChannel?: VoiceBasedChannel;
  textChannel: GuildTextBasedChannel;
}

export interface PlayerItem {
  id: string;
  title: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  url: string;
}
