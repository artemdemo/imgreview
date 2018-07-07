#!/bin/sh

if [ "$NODE_ENV" = "production" ]; then
  npm run server:prod
else
  npm run server:dev
fi
