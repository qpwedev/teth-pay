//@ts-nocheck
const borrowSchema = {
    type: 'object',
    properties: {
        address: {
            type: "string"
        },
        amount: {
            type: "number"
        },
        username: {
            type: "string"
        }
    },
};

module.exports = borrowSchema;