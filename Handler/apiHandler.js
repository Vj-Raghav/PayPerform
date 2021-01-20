const Bank = require('../Models/model')
const validator = require('../Utilities/validator')
const updator = require('../Utilities/updator')


exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await Bank.find({ _id: req.body._id }).lean() //checking if ID already exists
        if (customer.length === 0) {
            validator.validateAccountNum(req.body.accDetails.accountNum)
            const status = await Bank.create(req.body)  //Adding new customer
            if (status) {
                res.status(200).json({
                    status: 'success below customer Added',
                    data: {
                        status
                    }
                })
            }
        } else {
            let err = new Error("Id already Exists")
            err.statusCode = 406
            throw err  //throwing error to catch block
        }
    }
    catch (err) {
        next(err)    //forwarding the error to the error logger
    }
}
//Adding account based on id

exports.addAccountDetails = async (req, res, next) => {
    try {
        const customer = await Bank.find({ _id: req.body._id }).lean()
        if (customer.length) {
            validator.validateAccountNum(req.body.accDetails.accountNum)
            const status = updator.updateFunction({ _id: req.body._id }, //updating Account details based on ID
                { $push: { "accDetails": req.body.accDetails } })
            if (status) {
                res.status(200).json({
                    status: 'Account Details Added',
                })
            } else {
                let err = new Error("some Error in DB")
                err.statusCode = 502
                throw err
            }
        } else {
            let err = new Error("Customer Not Existing")
            err.statusCode = 406
            throw err
        }

    } catch (err) {
        next(err)
    }
}

//Balance transfer between any two accounts and logging transfer history to both account

exports.balanceTransfer = async (req, res, next) => {
    try {
        const fromAccountNum = await Bank
            .aggregate([{ $match: { "accDetails.accountNum": req.body.fromAccountNum } }, {
                $unwind: "$accDetails"
            }, { $match: { "accDetails.accountNum": req.body.fromAccountNum } }])
        const toAccountNum = await Bank
            .aggregate([{ $match: { "accDetails.accountNum": req.body.toAccountNum } }, {
                $unwind: "$accDetails"
            }, { $match: { "accDetails.accountNum": req.body.toAccountNum } }])
        let toBalance = toAccountNum[0].accDetails.balance   //fetching balnce and Id from To Account
        let toId = toAccountNum[0]._id
        let fromBalance = fromAccountNum[0].accDetails.balance
        let fromId = fromAccountNum[0]._id              //fetching balance and Id from From account
        if (req.body.amount > fromBalance) {
            let err = new Error("Insuffient Balance")
            err.statusCode = 406
            throw err
        } else {
            let remainingFromBalance = fromBalance - req.body.amount
            let updatedToBalance = toBalance + req.body.amount
            updator.updateFunction({ _id: toId, "accDetails.accountNum": req.body.toAccountNum },
                { "accDetails.$.balance": updatedToBalance })
            updator.updateFunction({ _id: fromId, "accDetails.accountNum": req.body.fromAccountNum },
                { "accDetails.$.balance": remainingFromBalance })
            var transferArray = {
                fromAccount: req.body.fromAccountNum,
                toAccount: req.body.toAccountNum, amount: req.body.amount,
                comments: req.body.comments
            }
            //updating transfer history for both accounts
            updator.updateFunction({ _id: fromId }, { $push: { "transferHistory": transferArray } })
            updator.updateFunction({ _id: toId }, { $push: { "transferHistory": transferArray } })
            res.status(200).json({ message: "Balance Transferred successfully" })
        }
    } catch (err) {
        next(err)
    }
}

//fetching balance for given account number

exports.getBalance = async (req, res, next) => {
    try {
        const balance = await Bank.aggregate([
            { $unwind: "$accDetails" },
            { $match: { "accDetails.accountNum": parseInt(req.params.accountNum) } },
            { $project: { AvailableBalance: "$accDetails.balance", _id: 0 } },])
        if (balance.length > 0) {
            res.status(200).json(balance)
        } else {
            let err = new Error("Account Number Not exist")
            err.statusCode = 406
            throw err
        }
    } catch (err) {
        next(err)
    }
}

//fetching transferHistory for given account number
exports.transHistory = async (req, res, next) => {
    try {
        const transHistory = await Bank.aggregate([             
            { $match: { "accDetails.accountNum": parseInt(req.params.accountNum) } },
            { $project: { transferHistory: 1, _id: 0 } },
            {$unwind:"$transferHistory"},
            {
                $match: {$or:[
                    
                        {"transferHistory.toAccount": parseInt(req.params.accountNum)},
                        {"transferHistory.fromAccount": parseInt(req.params.accountNum)}
                    
                ]}
            }])   //This will filter only the transaction for given account even if the customer having multiple Accounts
        if (transHistory.length > 0) {
            res.status(200).json(transHistory)
        } else {
            res.status(200).json({ message: "No Transaction Available" })
        }
    } catch (err) {
        next(err)
    }
}