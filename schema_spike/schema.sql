DROP DATABASE IF EXISTS prrr_schema_spike;
CREATE DATABASE prrr_schema_spike;

\c prrr_schema_spike

CREATE TABLE pull_requests(
  id SERIAL PRIMARY KEY,
  owner VARCHAR(255) NOT NULL,
  repo VARCHAR(255) NOT NULL,
  number INTEGER NOT NULL
);

CREATE TABLE users(
  github_username VARCHAR(255),
  name VARCHAR(255)
);

CREATE TABLE prrrs(
  id SERIAL PRIMARY KEY,
  pull_request_id SERIAL,
  created_at TIMESTAMP,
  archived_at TIMESTAMP
);

CREATE TABLE requesters(
  prrr_id INTEGER NOT NULL,
  github_username VARCHAR(255) NOT NULL
);

CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  prrr_id INTEGER NOT NULL,
  github_username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  -- updated_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  skipped_at TIMESTAMP
);
