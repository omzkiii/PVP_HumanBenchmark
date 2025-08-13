-- +goose Up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (username, password)
VALUES 
    ('alice', 'password123'),
    ('bob', 'secret456'),
    ('carol', 'pass789');


-- +goose Down
DROP TABLE users;
