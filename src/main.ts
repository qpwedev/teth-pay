import { config } from 'dotenv';
config();

import { Telegraf, Context } from 'telegraf';
import { connectWalletHandler, inlineQueryHandler, inlineQueryResultHandler, startHandler } from './handlers';

console.log('Starting bot...');
console.log(process.env.BOT_TOKEN)

const bot = new Telegraf(process.env.BOT_TOKEN || '');

bot.start(
    startHandler
);

bot.action(
    "connect-wallet",
    connectWalletHandler
)

bot.action(
    'back',
    startHandler
)

bot.on(
    'inline_query',
    inlineQueryHandler
)

bot.on(
    'chosen_inline_result',
    inlineQueryResultHandler
)


bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
