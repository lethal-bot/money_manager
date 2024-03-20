const express = require('express');
const User = require('../models/user')
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp')
const mailer = require('../helpers/mailer')
const router = new express.Router();


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (!user.isVerified) return res.status(401).send({ message: "not verified" });
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users', async (req, res) => {
    console.log(req.body);
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000);
    try {
        const user = await new User(req.body);
        // const token = await user.generateAuthToken()
        const otp = generateOtp()
        const msg = `<h3>${otp}</h3>`
        console.log(req.body.email);
        await mailer.sendMail(req.body.email, 'Mail Verification', msg)
        user.otp = otp.toString()
        await user.save();
        // res.status(201).send({ user, token })
        res.status(201).send({ user })
    } catch (e) {
        console.log(e.message);
        res.status(400).send(e);

    }
})


router.post('/verify/otp', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        console.log(user);
        if (!user) res.status(404).send(e);
        if (user.otp === req.body.otp) {
            user.isVerified = true;
            user.otp = undefined;
            const token = await user.generateAuthToken()
            await user.save();
            res.status(200).send({ token });
        } else res.status(500).send({ "message": "invalid otp" })
    } catch (e) {
        res.status(500).send(e);
    }
})

router.post('/verify/resendOtp', async (req, res) => {
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000);
    try {
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email })
        console.log(user);
        if (!user) res.status(404).send(e);
        const otp = generateOtp()
        const msg = `<h3>${otp}</h3>`
        // console.log(req.body.email);
        await mailer.sendMail(req.body.email, 'Mail Verification', msg)
        user.otp = otp.toString()
        await user.save();
        res.status(201).send()
    } catch (e) {
        res.status(500).send(e);
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


const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        const photoName = file.originalname
        if (!(photoName.endsWith('.jpg') || photoName.endsWith('.jpeg') || photoName.endsWith('.png'))) {
            return cb(new Error('File must be a PNG || JPEG || JPG!'))
        }
        cb(undefined, true)

        // cb(new Error('File must be a PDF!'))
        // cb(undefined,true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    try {
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send()
    }

})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error({ message: "no image" })
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
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