const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Expense = require('./expense');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is inValid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('length must be greater than 6')
            } else if (value === 'password') {
                throw new Error('password cannot be password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: undefined
    },



},
    {
        timestamps: true
    }
)

userSchema.virtual('userExpenses', {
    ref: 'Expense',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject()
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.otp;
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');
    user.tokens = user.tokens.concat({ token })

    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('unable to Login');
    }

    return user;
}

//hahsing the password
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

//deleting task
userSchema.pre('remove', async function (next) {
    const user = this;
    await Expense.deleteMany({ owner: user._id });
    next();
})

const User = mongoose.model('User', userSchema);

// const dummy = new User({
//     name: "Adityaa",
//     email: "aditya@gmail.com",
//     password: "hsbfahbs"
// })

// dummy.save().then(() => {
//     console.log(dummy)
// }).catch((error) => {
//     console.log(error);
// })
module.exports = User;