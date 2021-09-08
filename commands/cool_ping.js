const wait = require('util').promisify(setTimeout);
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cool_ping')
    .setDescription('Replies with Pong!')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select a channel for this reminder.')
    )
    .addIntegerOption((option) =>
      option.setName('timer').setDescription('How long to wait for reminder.')
    ),
  async execute(interaction) {
    const time = interaction.options.getInteger('timer') || 0;

    await interaction.deferReply();
    await wait(time * 1000);
    await interaction.editReply('Pong!');
  },
};
