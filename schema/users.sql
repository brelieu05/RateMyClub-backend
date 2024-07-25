CREATE TABLE public.users
(
    user_id SERIAL PRIMARY KEY,
    role character varying(16) NOT NULL,
    email character varying(256),
    firebase_uid character varying(128),
    club_id INTEGER,
    CONSTRAINT fk_club
        FOREIGN KEY (club_id)
        REFERENCES public.clubs (club_id)
);