const db = require("../models");
const User = db.user;
const Profile = db.profile;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    User.findOne({ where: { email: req.body.email }})
    .then((user) => {
        if(user) {
            throw new Error('Email already in use.')
        }

        bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = {
                email: req.body.email,
                password: hash,
            };

            User.create(user).then((createdUser) => {
                const profilename = req.body.email.split('@')[0];
                const profile = {
                    name: profilename
                };
                Profile.create(profile).then((createdProfile) => {
                    createdProfile.setUser(createdUser);
                })
            })

            res.status(201).json({
                 message: 'Profile registered!'
            })
        })
        .catch((err) => res.status(501).json({ error: err.message }))  
    })
    .catch((err) => res.status(501).json({ error: err.message }))
};

exports.login = (req, res) => {
    User.findOne( { where: {email: req.body.email}} )
    .then((user) => {
        if(!user) {
            return res.status(404).json({
                error: new Error('Invalid email adress!').message
            })
        };

        bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
            if(!valid) {
                return res.status(401).json({
                    error: new Error('Unauthorized!').message
                })
            };

            const profileId = user.profileId;
            const token = jwt.sign(
                { profileId: profileId },
                process.env.TOKEN_KEY,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                profileId: profileId,
                token: token
            })
        })

        .catch(() => {
            res.status(401).json({
                error: new Error('Something happened. Could not login')
            })
        })
    })

    .catch(() => {
        res.status(500).json({
            error: new Error('Could not login')
        })
    })
    
};