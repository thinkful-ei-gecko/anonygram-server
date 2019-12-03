CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    comment_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    submission_id INTEGER
        REFERENCES submission(id) ON DELETE CASCADE NOT NULL,
    user_id uuid
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);