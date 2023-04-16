

const editOrSend = async (ctx: any, text: string, markup?: any) => {
    let messageId = ctx.update.callback_query?.message?.message_id;

    try {
        await ctx.telegram.editMessageText(
            ctx.chat!.id,
            messageId,
            undefined,
            text,
            {
                reply_markup:
                {
                    inline_keyboard: markup
                }

            }
        );
        console.log('Message edited successfully')
    } catch (error) {
        console.log('Editing failed, sending new message:', error);
        const sentMessage = await ctx.reply(
            text,
            {
                reply_markup:
                {
                    inline_keyboard: markup
                }

            }
        );
        messageId = sentMessage.message_id;
    }

    return messageId;
};

export {
    editOrSend
}