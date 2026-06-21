const AccountModel = require('../models/AccountModel');
const TransactionModel = require('../models/Transaction');
const db = require('../../config/db');
const authController = require('./authController');

const accountController = {
    // getBalance :async(userId)=>{
    //     const query = 'SELECT balance FROM accounts WHERE user_id = $1';
    //     const result = await db.query(query,[userId]);
    //     return result.rows[0];
    // },
    // deposit:async()
    getBalance: async(req,res) =>{
        try{
            const userId = req.user.id;
            const query = 'SELECT balance FROM accounts WHERE user_id = $1';
            const result = await db.query(query,[userId]);

            if (!result.rows[0]){
                return res.status(404).json({error:'Account not found'})
            }
            res.status(200).json({balance:result.rows[0].balance});
        }catch (error){
            res.status(500).json({error:error.message});
        }
    },
    deposit:async(req,res)=>{
        try{
        const userId = req.user.id;
        const { amount } = req.body;
         if (!amount || isNaN(amount) || amount <=0){
            return res.status(400).json({error:'please enter a valid deposit amount(must be greater than 0'});
         }
         const account = await AccountModel.findByUserID(userId);
         if (!account){
            return res.status(404).json({error:'Account not found'});
         }
         const updateQuery = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *';
         const updated = await db.query(updateQuery,[amount,account.id]);
         await TransactionModel.createTransaction(null, account.id, amount, 'deposit','Deposit');

         res.status(200).json({
            message:'Deposit successful',
            newBalance:updated.rows[0].balance
         });
        }catch (error){
            res.status(500).json({error:error.message});
        }
    },
    withdraw:async(req,res) =>{
        try{
            const userId = req.user.id;
            const { amount } = req.body;
            const query = 'SELECT balance FROM accounts WHERE user_id =$1';
            const result = await db.query(query,[userId])
            const account = await AccountModel.findByUserID(userId);
            if (!account)
            {
            return res.status(404).json({error:'Account not found'});
            }
            const accountbal = account;
            

            if (accountbal.balance < amount){
                throw new Error ('Insufficient Funds');
            }
            const updateQuery = 'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *';
            const update = await db.query(updateQuery,[amount,account.id])
            TransactionModel.createTransaction(account.id, null, amount, 'withdraw', 'Withdrawal');

            res.status(200).json({
                message:'Withdraw Successful',
                newBalance:update.rows[0].balance
            });
        }catch (error){
            res.status(500).json({error:error.message});
        }
        
    },
    transfer:async(req,res)=>{
        try{
            const userId = req.user.id;
            const { amount,receiverAccountNumber } = req.body;

            if(!receiverAccountNumber){
                return sessionStorage.status(400).json({error:'Recipient Account number is required'})
            }
            if (!amount || isNaN(amount) || amount <= 0) 
                {
                return res.status(400).json({ error: 'Please provide a valid transfer amount greater than 0' });
            }
            const senderAccount = await AccountModel.findByUserID(userId);
            if(!senderAccount){
                return res.status(404).json({error:'sender account not found'});
            }
            const receiverAccount = await AccountModel.findByAccountNumber(receiverAccountNumber);
            if (!receiverAccount){
                return res.status(404).json({error:'Receiver not found'});
            }
            if (senderAccount.id === receiverAccount.id) {
            return res.status(400).json({ error: 'Cannot transfer to your own account' });
            }
            if (senderAccount.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
            }

            await db.query('BEGIN');
            const deductQuery = 'UPDATE accounts SET balance = balance - $1 WHERE id = $2 RETURNING *';
            const senderUpdated = await db.query(deductQuery, [amount, senderAccount.id]);
            const addQuery = 'UPDATE accounts SET balance = balance + $1 WHERE id = $2 RETURNING *';
            await db.query(addQuery,[amount,receiverAccount.id]);

            await TransactionModel.createTransaction(
                senderAccount.id,
                receiverAccount.id,
                amount,
                'transfer',
                'Transfer'
            );

            await db.query('COMMIT');
            res.status(200).json({
                message:'Transfer Successful',
                newBalance:senderUpdated.rows[0].balance
            });

        }catch(error){
            await db.query('ROLLBACK');
            res.status(500).json({error:error.message});
        }
    },

    getTransactions:async(req,res)=>{
        try{
        const userId = req.user.id
        const findaccount = await AccountModel.findByUserID(userId);
        if (!findaccount){
            return res.status(404).json({error:'Account not found'});
        }
        const transaction = TransactionModel.getTransactionByAccountId(findaccount.id);
        res.status(200).json({transaction});
        }
        catch(error){
            res.status(500).json({error:error.message});

        }
    }
};

module.exports =accountController;