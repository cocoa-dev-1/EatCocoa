import { EmbedBuilder, EmbedData } from "discord.js";
import { defaultFooter, defaultThumbnail } from "./asset";

export const createEmbed = (data: EmbedData): EmbedBuilder => {
  return new EmbedBuilder({
    title: data.title || null,
    description: data.description || null,
    url: data.url || null,
    timestamp: data.timestamp || Date.now(),
    color: data.color || null,
    footer: data.footer || defaultFooter,
    image: data.image || null,
    thumbnail: data.thumbnail || null,
    provider: data.provider || null,
    author: data.author || null,
    fields: data.fields || null,
    video: data.video || null,
  });
};
