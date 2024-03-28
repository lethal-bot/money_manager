require('dotenv').config();
const mongoose = require('mongoose')
let url = process.env.DB_URL
mongoose.connect(url)