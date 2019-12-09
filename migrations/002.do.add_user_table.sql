DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text NOT NULL,
  password text NOT NULL,
  karma_balance INTEGER DEFAULT 50
);