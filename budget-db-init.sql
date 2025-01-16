CREATE DATABASE budget_db;

\c budget_db

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    limit_sum NUMERIC NOT NULL,
    alert_threshold NUMERIC DEFAULT 0.9
);
