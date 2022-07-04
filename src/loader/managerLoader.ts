import { Client } from "discord.js";
import { EatCocoa } from "../structures/Client";
import { Manager } from "../structures/Manager";

export const loadManager = async (client: EatCocoa) => {
  client.music = new Manager();
};
