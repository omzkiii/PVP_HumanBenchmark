# curl -c cookie.txt -b cookie.txt localhost:3000
post() {
   # curl -c cookie.txt -b cookie.txt \
   curl -d "$(printf '{"username": "%s", "password_hash": "%s"}' "$1" "$2")" \
      -X POST \
      -H 'Content-Type: application/json' \
      localhost:3000/signup
}
post peter mypassword123
