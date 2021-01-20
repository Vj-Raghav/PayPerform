//This file will log all incoming request to RequestLogger.txt
const fs = require('fs');

var RequestLogger = (req, res, next) => {
    var logMessage = "" + new Date() + " " + req.method + " " + req.url + "\n";
    fs.appendFile('RequestLogger.txt', logMessage, (err) => {
        if (err) return next(err);
    });
    next();
}

module.exports = RequestLogger;