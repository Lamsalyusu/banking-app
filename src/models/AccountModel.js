const db = require('../../config/db');
const AccountModel = {

    create:async(userId,accountNumber,initialBalance = 0.00)=>{
        const query = `INSERT INTO accounts (user_id,account_number,balance)
        VALUES ($1,$2,$3) RETURNING id,account_number,balance;`
        ;
        const result = await db.query(query,[userId,accountNumber,initialBalance]);
        return result.rows;
    },

    findByUserID: async(userId)=>{
        const query = 'SELECT * FROM accounts WHERE user_id = $1';
        const result = await db.query(query,[userId]);
        return result.rows[0];
    },

    findByAccountNumber: async(accountNumber) => {
        const query = 'SELECT * FROM accounts WHERE account_number = $1';
        const result = await db.query(query,[accountNumber]);
        return result.rows[0];

    }
};
module.exports = AccountModel;