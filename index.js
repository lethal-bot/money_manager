require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./src/db/mongoose.js')
const userRouter = require('./src/routers/user_endpoints.js')
const expenseRouter = require('./src/routers/expense_endpoints.js')
const app = express();
app.set("trust proxy", 1);

app.use(
    cors({
        origin: "*",
        allowedHeaders: ["Authorization", "Content-Type", "type"],
    })
);

app.use(express.json())
app.use(userRouter);
app.use(expenseRouter);

app.listen(process.env.PORT, () => {
    console.log(`server is up on the port ${process.env.PORT}`)
})



