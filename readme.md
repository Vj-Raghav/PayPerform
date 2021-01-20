CreateCust --> POST @/create -->
It will add customer with unique id and account number should be 10 digits
below is the reference input
{"_id":4,
"name":"Raghavan",
"dob":"20-11-1994",
"accDetails":{
"accountNum":5576543210,
"ifsc":"GDBC0001",
"branch":"vadapal",
"balance":90000}}

BlanceTransfer--> PUT @/balanceTransfer 
if the transaction amount is greater than account balance it will throw error.

{
"fromAccountNum":9087543210,
"toAccountNum":6076543210,
"amount":500,
"comments":"Monthly Interset"
}


AddAccountNum --> PUT @/AddNewAccount {"_id":3,"accDetails":{
"accountNum":2676543210,
"ifsc":"ICCD0001",
"branch":"Machu",
"balance":120000}}

fetchAccount Balance--> GET @/fetchBalance/7676543210

fetchTransactionHistory --> GET @ /fetchTransferHistory/7676543210