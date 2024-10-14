#!/bin/bash

echo -e "const DOMAIN = \"${DOMAIN}:${PORT}\"; export default DOMAIN;" > /usr/share/nginx/html/app/js/domain.js

exec "$@"
