const Bank = require('../Models/model')

let updator = {}
//Centralized update function for all updateOne operations

updator.updateFunction =async (query,value) => {
    const status = await Bank.updateOne(query,value)
    if(status){
        return true
    }else{
        return false
    }
}

module.exports = updator;