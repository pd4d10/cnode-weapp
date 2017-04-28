#!/usr/bin/env node

prettier --write --no-semi --trailing-comma=es5 --single-quote 'pages/**/*.js' app.js utils.js
