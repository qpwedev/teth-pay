import { Context } from "telegraf";
import { backKeyboard, inlineSendKeyboard, startKeyboard } from "./markups";
import { editOrSend, generateQRCode } from "./utils/utils";
import { InlineQueryResult } from "typegram";
import { InlineQueryType, validateInlineQuery } from "./validators";
import { getConnectionUri, sendTokens } from "./wallet-connect/conection";
import { activeSessions } from "./db";

const startHandler = async (ctx: Context) => {
    await editOrSend(ctx, 'Connect your wallet to start using the bot', startKeyboard(), './img/main.jpg');
}

const connectWalletHandler = async (ctx: Context) => {
    try {
        const uri = await getConnectionUri(ctx);

        const chatId = ctx.chat!.id;
        const outputFilePath = './img/' + chatId + 'qrcode.png';

        await generateQRCode(uri.toString(), outputFilePath);
        await editOrSend(ctx, 'Connecting wallet...', backKeyboard, outputFilePath);
    }
    catch (error) {
        console.log(error);
    }
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

const inlineQueryResultHandler = async (ctx: any) => {
    // test data 
    const web3Provider = activeSessions.get("123");
    const inlineQueryMessage = ctx.update.chosen_inline_result!.query;
    const type = validateInlineQuery(inlineQueryMessage);
    console.log(type)
    console.log("inlineQueryMessage", inlineQueryMessage);

// add validation
    try {
        const [username, amount, currency] = inlineQueryMessage.split(' ');
        await sendTokens(
            // @ts-ignore
            web3Provider,
            "0xB09AE5670c0FA938BfEeEe3E2653dcD18cDaA68e",
            amount, currency
        );
    } catch (error) {
        console.log(error);
    }


}


export {
    startHandler,
    connectWalletHandler,
    inlineQueryHandler,
    inlineQueryResultHandler
};
