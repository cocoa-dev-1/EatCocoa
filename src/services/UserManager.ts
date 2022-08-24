import { GuildMember, User as DiscordUser } from "discord.js";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { client } from "../bot";
import { User } from "../entities/User";
import { ECDataSource } from "../loader/typeormLoader";

@Service()
export class UserManager {
  userRepository: Repository<User>;
  constructor() {
    this.userRepository = ECDataSource.getRepository(User);
  }

  async get(id: string): Promise<User | null> {
    const result = await this.userRepository.findOne({
      where: {
        discordId: id,
      },
    });
    return result;
  }

  async getDiscordUser(id: string): Promise<DiscordUser> {
    const user = client.users.cache.get(id);
    return user;
  }

  async create(id: string): Promise<User> {
    const discordUser = await this.getDiscordUser(id);
    const user = await this.userRepository.create();
    user.discordId = id;
    user.name = discordUser.username;
    user.tag = discordUser.tag;
    const result = await this.userRepository.save(user);
    return result;
  }
}
