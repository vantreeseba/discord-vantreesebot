const { SlashCommandBuilder } = require('@discordjs/builders');
const chrono = require('chrono-node');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeating-reminder')
    .setDescription('Sets a reminder a day and time')
    .addStringOption((option) =>
      option.setName('reminder').setDescription('What is the reminder')
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const reminder = interaction.options.getString('reminder');

    if (reminder) {
      const parsed = chrono.parse(reminder);
      console.log('wee', JSON.stringify(parsed, null, 2));
      if (parsed?.length) {
        const { start } = parsed[0];
        const values = { ...start.knownValues, ...start.impliedValues };

        const date = chrono.parseDate(reminder);

        const dayOfWeek = daysOfWeek[date.getDay()];
        const hour = date.getHours();
        let minutes = date.getMinutes().toString();
        if (minutes.length == 1) {
          minutes = '0' + minutes;
        }

        const reminderName = reminder.substring(0, parsed[0].index).trim();

        const minute = 60000;
        const twentyBefore = minute * 20;
        const tenBefore = minute * 10;

        const interval = setInterval(() => {
          if (Date.now() + twentyBefore > date.getTime()) {
            interaction.channel.send(
              `!!!!!!!!! ${reminderName} in 20 mins !!!!!!!!!`
            );
          }
          if (Date.now() + tenBefore > date.getTime()) {
            interaction.channel.send(
              `!!!!!!!!! ${reminderName} in 10 mins !!!!!!!!!`
            );
          }
          if (Date.now() > date.getTime()) {
            interaction.channel.send(`!!!!!!!!! ${reminderName} now !!!!!!!!!`);
            clearInterval(interval);
          }
        }, 10000);

        return interaction.reply(
          `Set reminders for ${reminderName} on ${dayOfWeek} at ${hour}:${minutes}`
        );
      }
    }

    return interaction.reply(
      `There was an issue creating the reminder, try again!`,
      { ephemeral: true }
    );
  },
};
