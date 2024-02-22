const express = require('express');
require('./src/db/mongoose.js')
const userRouter = require('./src/routers/user_endpoints.js')
const expenseRouter = require('./src/routers/expense_endpoints.js')
const app = express();

app.use(express.json())
app.use(userRouter);
app.use(expenseRouter);

app.listen(3000, () => {
    console.log('server is up on the port 3000')
})