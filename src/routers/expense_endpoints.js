const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Expense = require('../models/expense');
// const User = require('../models/user');

router.get('/expense', auth, async (req, res) => {
    try {
        const expense = await Expense.find({ owner: req.user._id })
        // const user = await User.findById(req.user._id);
        // await user.populate('userExpenses')
        // console.log(user.userExpenses);
        res.send(expense);

    } catch (e) {
        res.status(501).send();
    }
})

router.post('/expense', auth, async (req, res) => {
    // const expense = new Expense(req.body);
    const expense = new Expense({
        ...req.body,
        owner: req.user._id
    })
    try {
        await expense.save();
        res.status(201).send("expense added");
    } catch (e) {
        res.status(501).send("expense not added");
    }
})

router.get('/expense/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const expense = await Expense.findOne({ _id, owner: req.user._id })

        if (!expense) {
            return res.status(404).send()
        }
        res.send(expense);
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/expense/find', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const availableUpdates = ['price', 'description', 'title'];
    const canUpdate = updates.every((update) => availableUpdates.includes(update));
    if (!canUpdate) res.status(501).send("unavailable search");
    else {
        try {
            const expenses = await Expense.find({ owner: req.user._id, ...req.body });
            console.log(expenses);
            if (!expenses) res.status(404).send();
            res.send(expenses);
        } catch (e) {
            res.status(501).send(e);
        }
    }


})

router.patch('/expense/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const availableupdates = ['description', 'price', 'title'];
    const canUpdate = updates.every((update) => availableupdates.includes(update));
    if (!canUpdate) res.status(501).send("mismatched key names");
    else {
        try {
            const expense = await Expense.findOne(req.params._id);

            // const expense = await Expense.findById(req.params.id);
            if (!expense) res.status(404).send("no expense found");
            else {
                updates.forEach((key) => {
                    expense[key] = req.body[key];
                })
                await expense.save()
                res.status(201).send(expense);
            }
        } catch (e) {
            res.status(501).send(e);
        }
    }

})

router.delete('/expense/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) res.status(404).send("not Found to delete");
        else {
            res.status(201).send(expense);
        }
    } catch (e) {
        res.status(501).send(e);
    }
})


module.exports = router;
