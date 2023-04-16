import { Context } from "telegraf";
import { backKeyboard, inlineSendKeyboard, inlineSplitKeyboard, startKeyboard } from "./markups";
import { editOrSend, generateQRCode } from "./utils/utils";
import { InlineQueryResult } from "typegram";
import { InlineQueryType, validateInlineQuery } from "./validators";
import { getConnectionUri, sendTokens } from "./wallet-connect/conection";
import { activeSessions } from "./db";

const startHandler = async (ctx: Context) => {
    await editOrSend(ctx, 'Connect your wallet to start using the bot', startKeyboard(), './img/main.jpg', false);
}

const connectWalletHandler = async (ctx: Context) => {
    try {
        const uri = await getConnectionUri();

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

    } else if (type === InlineQueryType.SPLIT) {
        const [ amount, currency] = inlineQueryMessage.split(' ');
        const usernamePattern = /@\w+/g;
        const usernames = inlineQueryMessage.match(usernamePattern) || [];
        const usernamesString = usernames.join(", ");

        const value = Number(amount) / usernames.length;
        
        let msgText = '';
        usernames.forEach((username) => {
            msgText += `${username} ${value} ${currency}\n`

            // borrowStore.create({
            //     address: '',
            //     amount: value,
            //     username: username.slice(1)
            // })
        })

        result = [
            {
                type: 'article',
                id: '1',
                title: 'Split button',
                input_message_content: {
                    message_text: `Splitting the bill\n\n${msgText}`
                },
                description: `Splitting the ${amount} ${currency} between ${usernamesString}`,
                reply_markup: {
                    inline_keyboard: inlineSplitKeyboard()
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

    let result: InlineQueryResult[];

    if (type === InlineQueryType.SEND) {
        const [username, amount, currency] = inlineQueryMessage.split(' ');
        await sendTokens(
            // @ts-ignore
            web3Provider,
            "0xB09AE5670c0FA938BfEeEe3E2653dcD18cDaA68e",
            amount, currency
        );
    }

}

// const splitHandler = async (ctx: Context) => {
//     const name = ctx.callbackQuery.from.username;

//     await borrowStore.readAll().then((borrowers:any[]) => {
//         const isBorrower = borrowers.some(
//             (borrower) => borrower.username === name
//         )

//         if (isBorrower) console.log('borrower');
        
//     })
// }

export {
    startHandler,
    connectWalletHandler,
    inlineQueryHandler,
    inlineQueryResultHandler
};
