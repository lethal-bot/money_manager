const mongoose = require('mongoose');

const Expense = mongoose.model('Expense', {
    title: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (value.length > 30) throw new Error("too long title");
        }
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if (value <= 0) throw new Error("price cannot be less than equal 0");
        }
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})



module.exports = Expense;