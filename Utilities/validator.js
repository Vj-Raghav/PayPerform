let validator = {}

//validates Account Number

validator.validateAccountNum = (AccNum) => {
    AccNum = AccNum + ""
    if (AccNum.length === 10) {
        return true
    } else {
        let err = new Error("Account Number should be 10 digits")
        err.statusCode = 400
        throw err
    }
}

module.exports = validator;