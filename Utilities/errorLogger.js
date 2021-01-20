var fs = require('fs')
//All errors will be logged to errorLogger.txt file
var logger = (err, req, res, next) => {
    statuscode = 400
    if (err) {
        statuscode = err.statusCode || 400
        fs.appendFile('errorLogger.txt', err + "\n", () => { })
        res.status(statuscode).json({ "message": err.message })
    }
    next()
}

module.exports = logger;