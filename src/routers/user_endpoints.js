const express = require('express');
const User = require('../models/user')
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).send(data);
    } catch {
        res.send("Empty Database");
        res.status(404);
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201);
        res.send('user Created');
    } catch (e) {
        res.status(501);
        res.send(e);
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    // console.log(_id);
    try {
        const user = await User.findById(_id);
        if (user) {
            res.send(user);
            res.status(201);
        } else res.status(501).send("not found");
    } catch (e) {
        res.status(501);
        res.send(e);
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) res.send("no user found").status(404);
        else res.send(user);
    } catch (e) {
        res.status(501).send(e);
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    // console.log(updates);
    const availableupdates = ["name", "email", "password"];
    const canUpdate = updates.every((update) => availableupdates.includes(update));
    // console.log(canUpdate);
    if (!canUpdate) {
        res.status(501).send("property not availble for update");
    } else {
        try {
            const user = await User.findById(req.params.id);
            if (!user) res.status(404).send("user not found");
            updates.forEach((key) => {
                user[key] = req.body[key];
            })
            await user.save();
            res.send(user).status(201);
        } catch (e) {
            res.status(501).send(e);
        }
    }

})



module.exports = router;