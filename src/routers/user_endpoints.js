const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken()
        res.status(201);
        console.log(user);
        res.send({ user, token });
    } catch (e) {
        console.log(e.message);
        res.send(e);
    }
})

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})



// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     // console.log(_id);
//     try {
//         const user = await User.findById(_id);
//         if (user) {
//             res.send(user);
//             res.status(201);
//         } else res.status(501).send("not found");
//     } catch (e) {
//         res.status(501);
//         res.send(e);
//     }
// })

router.delete('/users/me', auth, async (req, res) => {
    try {
        // console.log(req.user);
        await req.user.deleteOne()
        // console.log(req.user);
        res.send("deleted user");
    } catch (e) {
        res.status(501).send(e);
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    // console.log(updates);
    const availableupdates = ["name", "email", "password"];
    const canUpdate = updates.every((update) => availableupdates.includes(update));
    // console.log(canUpdate);
    if (!canUpdate) {
        res.status(501).send("property not availble for update");
    } else {
        try {
            // const user = await User.findById(req.params.id);
            // if (!user) res.status(404).send("user not found");
            updates.forEach((key) => {
                req.user[key] = req.body[key];
            })
            await req.user.save();
            res.send(req.user).status(201);
        } catch (e) {
            res.status(501).send(e);
        }
    }

})



module.exports = router;