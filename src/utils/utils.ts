import * as QRCode from 'qrcode';
import * as fs from 'fs';
import { Context } from 'telegraf';

async function generateQRCode(data: string, outputFilePath: string): Promise<void> {
    try {
        const qrCodeImageBuffer = await QRCode.toBuffer(data);
        fs.writeFileSync(outputFilePath, qrCodeImageBuffer);
        console.log(`QR code image saved to ${outputFilePath}`);
    } catch (error) {
        console.error(`Failed to generate QR code: ${error}`);
    }
}


const editOrSend = async (
    ctx: any,
    text: string,
    markup?: any,
    imagePath: string = './img/main.jpg',
    edit: boolean = true
) => {
    let messageId = ctx.update.callback_query?.message?.message_id;


    if (edit) {
        try {
            const photoStream = fs.createReadStream(imagePath);

            await ctx.telegram.editMessageMedia(
                ctx.chat!.id,
                messageId,
                undefined,
                {
                    type: "photo",
                    media: { source: photoStream },
                    caption: text,
                },
                {
                    reply_markup: {
                        inline_keyboard: markup,
                    },
                }
            );
        } catch (error) {
            const photoStream = fs.createReadStream(imagePath);
            const sentMessage = await ctx.telegram.sendPhoto(
                ctx.chat!.id,
                { source: photoStream },
                {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: markup,
                    },
                }
            );

            messageId = sentMessage.message_id;
        }
    } else {
        const photoStream = fs.createReadStream(imagePath);

        const sentMessage = await ctx.telegram.sendPhoto(
            ctx.chat!.id,
            { source: photoStream },
            {
                caption: text,
                reply_markup: {
                    inline_keyboard: markup,
                },
            }
        );

        messageId = sentMessage.message_id;
    }

    return messageId;
};

export {
    editOrSend,
    generateQRCode
}