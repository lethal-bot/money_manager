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

//relating two models
// const Expense = require('./src/models/expense.js')
// const User = require('./src/models/user.js')

// const main = async () => {
//     const user = await User.findById('65da44e3efac7d2c5b4e967f');
//     await user.populate('userExpenses')
//     console.log(user.userExpenses)
// }

// main()

// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password, 8);
//     console.log(password, hashedPassword);

//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
//     console.log(isMatch);
// }

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc' }, 'thisismynewcourse', { expiresIn: '2 seconds' });
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse');
//     console.log(data);
// }

// myFunction();

