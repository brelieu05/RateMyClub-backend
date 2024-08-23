const express = require('express');

const universityRouter = express.Router();

const pool = require('../db');

universityRouter.use(express.json());


universityRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT DISTINCT ON (university, uni_abbr) university, uni_abbr, MIN(club_id) AS club_id FROM clubs WHERE university IS NOT NULL GROUP BY university, uni_abbr"
        );
        const universities = result.rows.map(row => ({
            university: row.university,
            uni_abbr: row.uni_abbr,
            club_id: row.club_id,
        }));
        res.json(universities);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

universityRouter.get("/:university/", async (req, res) => {
    const { university} = req.params;
    try {
        const clubs = await pool.query(
            "SELECT * FROM clubs WHERE university = $1",
            [university]
        );
        res.json(clubs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

universityRouter.get("/:university/clubs", async (req, res) => {
    const { university} = req.params;
    try {
        const clubs = await pool.query(
            "SELECT DISTINCT club_name FROM clubs WHERE university = $1",
            [university]
        );
        res.json(clubs.rows.map(club => club.club_name));
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})



module.exports = universityRouter;