const express = require("express");
const router = express.Router();
const Debug = require("../models/Debug");

router.get("/description", (req, res) => {
    Debug.describe()
        .then((data) => res.json(data))
        .catch((err) => {
            console.error(err);
            res.status(500).json({message: err.message});
        });
});

module.exports = router;
