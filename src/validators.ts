export enum InlineQueryType {
    SEND = 'send',
    VOTE = 'vote',
    UNKNOWN = 'unknown',
    SPLIT = "split"
}

const inlineQueryTypes = [
    {
        type: InlineQueryType.SEND,
        regex: /^@([a-zA-Z0-9_]{3,32})\s([0-9]+(\.[0-9]+)?)\s([A-Za-z]{3,5})$/g,

    },
    {
        type: InlineQueryType.VOTE,
        regex: /^kek$/g,
    },
    {
        type: InlineQueryType.SPLIT,
        regex: /^(\d+)\s+([a-zA-Z]+)\s+((@[a-zA-Z0-9_]+)\s*)+$/g
    },
]

const validateInlineQuery = (inlineQueryMessage: string): InlineQueryType => {
    for (const inlineQueryType of inlineQueryTypes) {
        if (inlineQueryType.regex.test(inlineQueryMessage)) {
            return inlineQueryType.type;
        }
    }

    return InlineQueryType.UNKNOWN;
}

export {
    validateInlineQuery
}