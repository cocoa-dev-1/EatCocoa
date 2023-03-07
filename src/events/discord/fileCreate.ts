import { Events, Message } from "discord.js";
import Container from "typedi";
import { FileManager } from "../../services/FileManager";
import { EcEvent } from "../../types/event";

const validated_channels = ["1072404889143103498"];

export const fileCreate: EcEvent = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (!validated_channels.includes(message.channelId)) return;
    if (!message.attachments) return;

    const fileManager = Container.get(FileManager);

    for (const attachment of message.attachments) {
      const file_data = attachment[1];
      if (!fileManager.validateFileType(file_data.name)) continue;

      const file_dir = fileManager.getDir(file_data.name);
      await fileManager.downloadFile(file_data.url, file_dir);
    }
  },
};
