const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

router.get('/expense', async (req, res) => {
    try {
        const expense = await Expense.find({});
        if (!expense) res.status(404).send("empty");
        else res.status(201).send(expense);
    } catch (e) {
        res.status(501).send();
    }
})

router.post('/expense', async (req, res) => {
    const expense = new Expense(req.body);
    try {
        await expense.save();
        res.status(201).send("expense added");
    } catch (e) {
        res.status(501).send("expense not added");
    }
})

router.patch('/expense/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const availableupdates = ['description', 'price', 'title'];
    const canUpdate = updates.every((update) => availableupdates.includes(update));
    if (!canUpdate) res.status(501).send("mismatched key names");
    else {
        try {
            const expense = await Expense.findById(req.params.id);
            if (!expense) res.status(404).send("no expense found");
            else {
                updates.forEach((key) => {
                    expense[key] = req.body[key];
                })
                expense.save()
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
