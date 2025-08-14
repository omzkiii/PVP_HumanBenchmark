post() {
   curl -c cookie.txt -b cookie.txt \
      -d "$(printf '{"username": "%s", "password_hash": "%s"}' "$1" "$2")" \
      -X POST \
      -H 'Content-Type: application/json' \
      localhost:3000/login
}
post peter mypassword123
