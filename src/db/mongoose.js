require('dotenv').config();
const mongoose = require('mongoose')
let url = process.env.DB_URL
console.log(url);
mongoose.connect(url)