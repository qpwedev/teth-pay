import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from 'dotenv';
config();

console.log('Starting bot...');
console.log(process.env.BOT_TOKEN)

const bot = new Telegraf(process.env.BOT_TOKEN || '');
bot.start((ctx: Context) => ctx.reply('Welcome'));
bot.help((ctx: Context) => ctx.reply('Send me a sticker'));

bot.hears('hi', (ctx: Context) => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
