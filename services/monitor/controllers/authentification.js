const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {auth} = require("../config");

router.post("/login", (req, res) => {
    const {userName, password} = req.body;
    const {pass, user, secret} = auth;
    if (userName !== user || password !== pass) {
        return res.status(401).json({success: false});
    }

    jwt.sign(
        {
            user,
        },
        secret,
        {
            algorithm: "HS256",
        },
        (err, payload) => {
            if (!err) {
                res.cookie("monitorAuth", payload, {
                    httpOnly: true,
                });
                return res.json({
                    success: true,
                });
            }
            console.error(err);
            res.status(500).json({
                err,
                success: false,
            });
        }
    );
});

router.use("*", (req, res, next) => {
    const token = req.cookies.monitorAuth;
    if (!token) {
        return res.status(401).json({
            message: "not authenticated",
        });
    }
    const {user, secret} = auth;
    jwt.verify(token, secret, function(err, decoded) {
        if (!decoded || decoded.user !== user) {
            return res.sendStatus(401).json({message: "session expired"});
        }
        next();
    });
});

module.exports = router;
