const express = require('express');

const reportsRouter = express.Router();

const pool = require('../db');

reportsRouter.use(express.json());

// description = ($1)
reportsRouter.post('/', async (req, res) => {
    const { review_id, report_description } = req.body;

    try {
        const newReport = await pool.query(
            "INSERT INTO reports (review_id, report_description) VALUES ($1, $2) RETURNING *",
            [review_id, report_description]
        );

        await pool.query(
            "UPDATE reviews SET num_reports = num_reports + 1 WHERE review_id = $1",
            [review_id]
        );

        res.json({ message: "Report created successfully", report: newReport.rows[0] });
    } catch (err) {
        console.error("Error creating report:", err.message);
        res.status(500).json({ error: err.message });
    }
});

reportsRouter.get("/", async (req, res) => {
    try {
        const allReports = await pool.query(
            "SELECT * FROM reports"
        );

        res.json(allReports.rows); // Send back the inserted report data
    }   
    catch (err) {
        console.log(err);
    }
});

reportsRouter.delete("/:report_id", async (req, res) => {
    const { report_id } = req.params;

    try {
        const deletedReview = await pool.query(
            "DELETE FROM reports WHERE report_id = $1 RETURNING *",
            [report_id]
        );

        if (deletedReview.rows.length === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Report deleted successfully", deletedReview: deletedReview.rows[0] });
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ error: err.message });
    }
});

reportsRouter.delete("/")



module.exports = reportsRouter;