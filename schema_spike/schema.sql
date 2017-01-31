DROP DATABASE IF EXISTS prrr_schema_spike;
CREATE DATABASE prrr_schema_spike;

\c prrr_schema_spike

CREATE TABLE pull_requests(
  id SERIAL PRIMARY KEY,
  owner VARCHAR(255),
  repo VARCHAR(255),
  number INTEGER
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE review_requests(
  id SERIAL PRIMARY KEY,
  pull_request_id SERIAL REFERENCES pull_requests(id),
  created_at TIMESTAMP,
  archived_at TIMESTAMP
);

CREATE TABLE requesters(
  review_request_id SERIAL REFERENCES review_requests(id),
  user_id SERIAL REFERENCES users(id)
);

CREATE TABLE reviews(
  id SERIAL PRIMARY KEY,
  review_request_id SERIAL REFERENCES review_requests(id),
  user_id SERIAL REFERENCES users(id),
  created_at TIMESTAMP,
  completed_at TIMESTAMP,
  abandoned_at TIMESTAMP
);
