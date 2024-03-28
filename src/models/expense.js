const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
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
    paid: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    // {
    //     timestamps: true
    // }
)



const Expense = mongoose.model('Expense', expenseSchema);


module.exports = Expense;