-- name: GetUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users (
   username, password_hash
) VALUES ( $1, $2 )
RETURNING id;
