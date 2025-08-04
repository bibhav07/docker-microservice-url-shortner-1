CREATE DATABASE shortenerdb;
\c shortenerdb;

CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL
);

CREATE TABLE stats (
  code VARCHAR(10) PRIMARY KEY,
  hits INTEGER DEFAULT 0
);
