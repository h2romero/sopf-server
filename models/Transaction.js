var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    pay: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = TransactionSchema;
