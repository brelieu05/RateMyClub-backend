CREATE DATABASE ratemyclub;

CREATE TABLE reviews(
    review_id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    review_date date,
    club_name VARCHAR(64), 
    rating INT CHECK (rating >= 1 AND rating <= 5),
    university VARCHAR(128),
    club_id INT,
    FOREIGN KEY (club_id) REFERENCES clubs (club_id),
    num_reports INT
);