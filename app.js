const express = require('express')
const fs = require('fs')
const bankRouter = require('./Router/routes');
const errorLogger = require('./Utilities/errorLogger')
const requestLogger = require('./Utilities/requestLogger')

const app = express();

app.use(express.json())

app.use(requestLogger)
app.use('', bankRouter);
app.use(errorLogger)

module.exports = app;