

const startKeyboard = () => {
    return [
        [{ text: "Connect Wallet", callback_data: "connect-wallet" }],
    ]
}

const backKeyboard = [
    [{ text: "Back", callback_data: "back" }],
]


const inlineSendKeyboard = () => {
    return [
        [{ text: "Refresh", callback_data: "refresh" }],
    ]
}

const inlineSplitKeyboard = () => {
    return [
        [{ text: "Pay", callback_data: "split_pay" }],
    ]
}

const inlinePayKeyboard = () => {
    return [
        [{ text: "Pay", callback_data: "pay" }],
    ]
}


export {
    startKeyboard,
    backKeyboard,
    inlineSendKeyboard,
    inlineSplitKeyboard, inlinePayKeyboard
}