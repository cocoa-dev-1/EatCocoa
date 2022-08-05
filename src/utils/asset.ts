import { EmbedAssetData, EmbedFooterData } from "discord.js";

export const defaultImage =
  "https://cdn.discordapp.com/attachments/990906808099029053/990906847806492682/533c9d51c5b74872.gif";

export const defaultFooter: EmbedFooterData = {
  text: "코코아 봇",
  iconURL: defaultImage,
};

export const defaultThumbnail: EmbedAssetData = {
  url: defaultImage,
};
