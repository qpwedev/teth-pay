import { Context } from "telegraf";
import { backKeyboard, inlineSendKeyboard, startKeyboard } from "./markups";
import { editOrSend } from "./utils/utils";
import { InlineQueryResult } from "typegram";
import { InlineQueryType, validateInlineQuery } from "./validators";

const startHandler = async (ctx: Context) => {
    await editOrSend(ctx, 'Connect your wallet to start using the bot', startKeyboard());
}

const connectWalletHandler = async (ctx: Context) => {
    console.log('connect wallet handler');

    await editOrSend(ctx, 'Connecting wallet...', backKeyboard);

}

const inlineQueryHandler = async (ctx: Context) => {
    const inlineQueryMessage = ctx.inlineQuery!.query;
    const type = validateInlineQuery(inlineQueryMessage);

    let result: InlineQueryResult[];

    if (type === InlineQueryType.SEND) {
        const [username, amount, currency] = inlineQueryMessage.split(' ');

        result = [
            {
                type: 'article',
                id: '1',
                title: `${amount} ${currency.toUpperCase()}`,
                input_message_content: {
                    message_text: `Waiting confirmation to send ${amount} ${currency.toUpperCase()} to ${username}`
                },
                description: `Send ${amount} ${currency.toUpperCase()} to ${username}`,
                reply_markup: {
                    inline_keyboard: inlineSendKeyboard()
                },
                thumb_url: 'https://telegra.ph/file/47b5c451ddd2af817d05c.jpg'
            }
        ]

    }
    else if (type === InlineQueryType.VOTE) {
        result = [
            {
                type: 'article',
                id: '1',
                title: 'SEND BLYAD',
                input_message_content: {
                    message_text: `Sending ${inlineQueryMessage}`
                },
                description: 'SEND BLYAD DESCRIPTION',
                reply_markup: {
                    inline_keyboard: inlineSendKeyboard()
                },
                thumb_url: 'https://telegra.ph/file/47b5c451ddd2af817d05c.jpg'
            }
        ]

    } else {
        // if unknown type
        return;
    }

    await ctx.answerInlineQuery(
        result,
        {
            cache_time: 0
        }
    );
}

const inlineQueryResultHandler = async (ctx: Context) => {
    console.log('inline query result handler');
    console.log(ctx);

}


export {
    startHandler,
    connectWalletHandler,
    inlineQueryHandler,
    inlineQueryResultHandler
};