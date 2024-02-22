const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }

})

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