const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models').User;

module.exports = {
    create(req, res) {
        const avarta = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(user => {
            if(user){
                return res.status(404).send({
                    email: 'Email already exists',
                });
            }
            handlePasswordHash(req, res, avarta);
        })
    },

    loginUser(req, res) {
        //  Call catch Validation errors function
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
        } catch (error) {
            return next(err)
        }
        // Get email and password
        const email = req.body.email;
        const password = req.body.password;
        //  Find the user by Email
        User.findOne({
            where: {
                email
            }
        }).then(user => {
            if (!user) {
                 return res.status(404).json({
                     email: 'User not found',
                 });
            }else if(!user.isVerified) {
                return res.status(200).json({
                    msg: 'Please confirm your email to login'
                })
            }
            // Check Password
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                checkPasswordMatch(user, res, isMatch);
            });
        })
    }


    
 }


 const checkPasswordMatch = (user, res, isMatch) => {
    if (isMatch) {
        // Create JWT payload
        const payload = {
            id: user.id,
            username: user.username,
            avarta: user.avarta
        }
        // Generate the token or Sign Token
        jwt.sign(payload, process.env.SECRETKEY, {
            expiresIn: 3600
        }, (err, token) => {
            res.json({
                success: true,
                token: 'Bearer ' + token
            })
        });
    } else {
        return res.status(400).json({
            password: 'Password incorrect'
        });
    }
 }


 const handlePasswordHash = (req, res, avarta) => {
       bcrypt.genSalt(10, (err, salt) => {
           bcrypt.hash(req.body.password, salt, (err, hash) => {
               if (err) throw err;
               req.body.password = hash;
               handleUserCreation(req, res, avarta);
           });
       })
 }

 const handleUserCreation = (req, res, avarta) => {
    //  Call catch Validation errors function
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
    } catch (error) {
        return next(err)
    }
    const { username, email, password } = req.body;
    return User
        .create({
            username: username,
            email: email,
            avarta,
            password: password

        })
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error));
 }
