CREATE TABLE clubs(
    club_id SERIAL PRIMARY KEY,
    club_name VARCHAR(64) NOT NULL,
    club_type VARCHAR(128),
    club_size VARCHAR(64),
    university VARCHAR(128),
    uni_abbr VARCHAR(8),
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    meeting_days TEXT[] DEFAULT ARRAY[]::TEXT[],
    disclaimer VARCHAR(256)
);
