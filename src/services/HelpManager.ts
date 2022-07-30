import {
  CommandInteraction,
  EmbedField,
  APIEmbedField,
  Interaction,
  ActionRowBuilder,
  MessageComponentInteraction,
  EmbedBuilder,
  SelectMenuBuilder,
  SelectMenuComponentOptionData,
  SelectMenuInteraction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { Service } from "typedi";
import { allCommands } from "../commands";
import { CommandCategory, CommandCategoryList } from "../types/command";
import { DiscordColor } from "../types/discord";
import { defaultImage } from "../utils/asset";

@Service()
export class HelpManager {
  constructor() {}

  async createHelpMessage(interaction: CommandInteraction) {
    const embed = new EmbedBuilder({
      author: {
        name: "코코아 봇",
      },
      title: "코코아 도움말",
      description: "아래의 메뉴를 선택하여 도움말을 확인할 수 있습니다.",
      color: DiscordColor.Aqua,
      thumbnail: {
        url: defaultImage,
      },
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
      timestamp: new Date(),
    });

    const helpRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new SelectMenuBuilder()
          .setCustomId("도움말")
          .setPlaceholder("코코아 봇의 명령어를 확인해보세요.")
          .addOptions(this.createHelpOptions())
      );

    await interaction.reply({
      embeds: [embed],
      components: [helpRow],
    });
  }

  createHelpOptions(): SelectMenuComponentOptionData[] {
    const helpOptions = CommandCategoryList.map((element) => {
      return {
        label: element.name,
        description: element.description,
        value: element.value,
      };
    });
    return helpOptions;
  }

  async updateHelpMessage(interaction: SelectMenuInteraction) {
    const selectedOption = interaction.values[0];
    const embed = new EmbedBuilder({
      author: {
        name: "코코아 봇",
      },
      title: selectedOption,
      color: DiscordColor.Aqua,
      description: `${selectedOption} 설명 입니다.`,
      fields: this.createHelpFields(selectedOption),
      thumbnail: {
        url: defaultImage,
      },
      timestamp: new Date(),
      footer: {
        text: "코코아 봇",
        iconURL: defaultImage,
      },
    });
    await interaction.update({
      embeds: [embed],
    });
  }

  createHelpFields(selectedOption: string): APIEmbedField[] {
    const commandsByOption = allCommands.filter(
      (command) => command.category === selectedOption
    );
    const helpFields = commandsByOption.map((command) => {
      return {
        name: `/${command.name}`,
        value: command.description,
        inline: true,
      };
    });
    if (helpFields.length === 0) {
      return [
        {
          name: "명령어가 아직 없습니다.",
          value: "null",
        },
      ];
    }
    return helpFields;
  }
}
