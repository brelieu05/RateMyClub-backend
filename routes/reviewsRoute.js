const express = require('express');

const reviewsRoute = express.Router();

const pool = require('../db');

reviewsRoute.use(express.json());

reviewsRoute.post("/", async (req, res) => {
    try {
        const { description, rating, club_id} = req.body;  
        const newReview = await pool.query(
            "INSERT INTO reviews (description, rating, club_id) VALUES($1, $2, $3) RETURNING *",
            [description, rating, club_id]  
        );
        res.json(newReview.rows[0]);
    }
    catch (err) {
        console.log(err.message);
    }
})


reviewsRoute.get("/", async (req, res) => {
    try {
        const allReviews = await pool.query("SELECT * FROM reviews");
        res.json(allReviews.rows);
    }
    catch (err) {
        console.log(err.message);
    }
})
// reviewsRoute.get("/:university/:club_name/reviews", async (req, res) => {
reviewsRoute.get("/:club_id/", async (req, res) => {
    const { club_id } = req.params;

    try {
        const reviews = await pool.query(
            "SELECT * FROM reviews WHERE club_id = ($1)",
            [club_id]
        );
        res.json(reviews.rows)
    }
    catch (err) {
        res.status(500).send("Server error");
    }
})


reviewsRoute.delete("/:review_id", async (req, res) => {
    const { review_id } = req.params;

    try {
        const deletedReview = await pool.query(
            "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
            [review_id]
        );

        if (deletedReview.rows.length === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully", deletedReview: deletedReview.rows[0] });
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ error: err.message });
    }
});

reviewsRoute.get("/id/:review_id", async (req, res) => {
    const { review_id } = req.params;

    try {
        const review = await pool.query(
            "SELECT * FROM reviews WHERE review_id = $1",
            [review_id]
        );

        res.json(review.rows);
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ error: err.message });
    }
});

reviewsRoute.post('/resetNumReports', async (req, res) => {
    const { review_id } = req.body;

    try {
        const updatedReview = await pool.query(
            "UPDATE reviews SET num_reports = 0 WHERE review_id = $1",
            [review_id]
        );

        res.json({updatedReview: updatedReview.rows[0], message: "message" + review_id}); // Send back the updated review data
    } catch (err) {
        console.error("Error resetting num_reports:", err.message);
        res.status(500).json({ error: err.message });
    }
});


module.exports = reviewsRoute;