const authConfig = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            });

            await user.setRoles(roles);
        } else {
            await user.setRoles([1]);
        }

        res.status(200).send({ message: "User was registered successfully!" });
    } catch (error) {
        // res.status(500).send({ message: error.message });
        res.status(400).send({ message: "An error occurred while processing the request." })
    }

};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) { return res.status(404).send({ message: "User not found" }); }

        const passwordInvalid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordInvalid) { return res.status(401).send({ accessToken: null, message: "invalid password" }); }

        const token = jwt.sign(
            { id: user.id },
            authConfig.secret, {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 86400
        });

        const roles = await user.getRoles();
        const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });

    } catch (error) {
        res.status(400).send({ message: "An error occurred while processing the request." })
    }

}