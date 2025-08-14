-- name: GetUsers :many
SELECT * FROM users;

-- name: CreateUser :one
INSERT INTO users (
   username, password_hash
) VALUES ( $1, $2 )
RETURNING id;

-- name: Login :one
SELECT password_hash FROM users
WHERE username = $1;
