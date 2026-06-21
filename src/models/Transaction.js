const db = require('../../config/db');
const TransactionModel = {

    createTransaction: async(senderAccountId, receiverAccountId, amount, type, description)=>{
    const query = `INSERT INTO transactions 
    (sender_account_id, receiver_account_id, amount, transaction_type, status, description) 
    VALUES ($1, $2, $3, $4, 'success', $5) 
    RETURNING *`;
    const result = await db.query(query,[senderAccountId, receiverAccountId, amount, type, description]);
    return result.rows[0];
    },

    getTransactionByAccountId: async(accountID)=>{
        const query = `SELECT * from transactions 
        WHERE sender_account_id = $1 OR receiver_account_id =$1 
        ORDER BY created_at DESC`;
        const result = await db.query(query,[accountID]);
        return result.rows;

    }
};
module.exports = TransactionModel