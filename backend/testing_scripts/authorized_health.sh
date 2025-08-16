get() {
   curl -c cookie.txt -b cookie.txt \
      localhost:3000/health
}
# post peter mypassword123
get peter mypassword123
