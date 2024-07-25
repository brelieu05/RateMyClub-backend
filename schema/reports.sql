CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
    report_description TEXT,
    report_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);