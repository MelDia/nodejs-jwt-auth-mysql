const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) return res.status(403).send({ message: "No token provided." });

    jwt.verify(token, config.secret, (error, decoded) => {
        if (error) return res.status(401).send({ message: "Unauthorized" });
        req.userId = decoded.id;
        next();
    })
}

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return
                }
            }

            return res.status(403).send({ message: 'Require Admin role.' });
        })
    })
}

isModerator = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return
                }
            }

            return res.status(403).send({ message: 'Require Moderator role.' });
        })
    })
}

isModOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator") {
                    next();
                    return
                }

                if (roles[i].name === "admin") {
                    next();
                    return
                }
            }

            return res.status(403).send({ message: 'Require Moderator or Admin role.' });
        })
    })
}

const jwtAuth = {
    verifyToken,
    isAdmin,
    isModerator,
    isModOrAdmin
}

module.exports = jwtAuth;