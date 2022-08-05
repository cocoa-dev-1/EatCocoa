import { VoicePacket } from "erela.js";
import { manager } from "../../loader/managerLoader";
import { EcEvent } from "../../types/event";

export const raw: EcEvent = {
  name: "raw",
  once: false,
  async execute(d: VoicePacket) {
    await manager.updateVoiceState(d);
  },
};
