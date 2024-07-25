const express = require('express');

const userRouter = express.Router();

const pool = require('../db');

userRouter.use(express.json());

userRouter.post("/", async (req, res) => {
    try {
        const { email, firebase_uid, role } = req.body;  
        const newUser = await pool.query(
            "INSERT INTO users (email, firebase_uid, role) VALUES ($1, $2, $3) RETURNING *",
            [email, firebase_uid, role]  
        );
        res.json(newUser.rows[0]);
    }
    catch (err) {
        console.log(err.message);
    }
})

userRouter.get("/:firebase_uid", async (req, res) => {
    try {
        const { firebase_uid } = req.params;  // Use req.params to get the firebase_uid from the URL
        const userResult = await pool.query(
            "SELECT * FROM users WHERE firebase_uid = $1",
            [firebase_uid]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = userRouter;