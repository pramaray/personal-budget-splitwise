const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expenses: [{
        description: String,
        amount: Number,
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
