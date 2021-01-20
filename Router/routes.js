const express = require('express');
const apiHandler = require('../Handler/apiHandler');

const router = express.Router();

router.route('/create').post(apiHandler.createCustomer);
router.route('/AddNewAccount').put(apiHandler.addAccountDetails)
router.route('/balanceTransfer').put(apiHandler.balanceTransfer)
router.route('/fetchBalance/:accountNum').get(apiHandler.getBalance)
router.route('/fetchTransferHistory/:accountNum').get(apiHandler.transHistory)
router.route("*").all((req, res,next) => {
    let err = new Error("Invalid Path")
    err.statusCode = 400
    next(err)
})


module.exports = router;