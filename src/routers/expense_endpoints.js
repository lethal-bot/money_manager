const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const Expense = require('../models/expense');
// const User = require('../models/user');

// /expense?paid=true/false
// /expense?limit=10&skip=10
// /expense?sortBy=createdAt_asc/desc

router.get('/expense', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.paid) {
        match.paid = req.query.paid === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        // const expense = await Expense.find({ owner: req.user._id })
        // const user = await User.findById(req.user._id);
        await req.user.populate({
            path: 'userExpenses',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        // console.log(user.userExpenses);
        res.send(req.user.userExpenses);

    } catch (e) {
        res.status(501).send();
    }
})

router.post('/expense', auth, async (req, res) => {
    // const expense = new Expense(req.body);
    if (req.body.paid === "paid") req.body.paid = true;
    else req.body.paid = false;
    const expense = new Expense({
        ...req.body,
        owner: req.user._id
    })
    try {
        await expense.save();
        res.status(201).send(expense);
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
    if (updates.includes('paid')) {
        req.body.paid = req.body.paid === "paid" ? true : false;
    }
    const availableUpdates = ['price', 'description', 'title', 'paid'];
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
    if (updates.includes('paid')) {
        req.body.paid = req.body.paid === "paid" ? true : false;
    }
    const availableupdates = ['description', 'price', 'title', 'paid'];
    const canUpdate = updates.every((update) => availableupdates.includes(update));
    if (!canUpdate) res.status(501).send("mismatched key names");
    else {
        try {
            const expense = await Expense.findOne({ owner: req.user._id, _id: req.params.id });

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
