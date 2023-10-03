const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkEmptyAttributes = (req, res, next) => {
    if (req.body) {
        const emptyKeys = [];
        for (const key in req.body) {
            if (!req.body[key]) {
                emptyKeys.push(key);
            }
        }

        if (emptyKeys.length > 0) {
            const emptyKeysMessage = emptyKeys
                .map(key => key.toUpperCase()).join(', ');
            res.status(400).send({
                message: `Failed! ${emptyKeysMessage} cannot be empty`
            });
            return;
        }
        next();
    }
}

checkDuplicateUsername = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }

        next();
    });
}

checkUsername = (req, res, next) => {
    if (req.body.username) {
        const username = req.body.username;
        const usernameRegex = /^[a-zA-Z0-9\-_.$]*$/;

        if (username.length < 5 || username.length > 15 || !usernameRegex.test(username)) {
            res.status(400).send({
                message: "Failed! Username must be between 5 and 15 characters long, and can contain letters (uppercase/lowercase), numbers, '-', '_', '.', and '$', but they are optional."
            });
            return;
        }

        next();
    }
}

checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(email => {
        if (email) {
            res.status(400).send({
                message: "Failed! Email is already in use"
            });
            return;
        }

        next();
    });
}

checkEmail = (req, res, next) => {
    if (req.body.email) {
        const email = req.body.email;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(email)) {
            res.status(400).send({
                message: "Failed! Invalid email format."
            });
            return;
        }

        next();
    }
}

checkStrongPassword = (req, res, next) => {
    if (req.body.password) {
        const pass = req.body.password;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;

        if (!strongPasswordRegex.test(pass)) {
            res.status(400).send({
                message: "Failed! Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (! \" # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~), and no spaces are allowed."
            });
            return;
        }
        next();
    }
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i].toUpperCase()} does not exist.`
                });
                return;
            }
        }
    }
    next();
}

const verify = {
    checkEmptyAttributes,
    checkDuplicateUsername,
    checkUsername,
    checkDuplicateEmail,
    checkEmail,
    checkStrongPassword,
    checkRolesExisted
}

module.exports = verify;