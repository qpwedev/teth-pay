

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


export {
    startKeyboard,
    backKeyboard,
    inlineSendKeyboard
}