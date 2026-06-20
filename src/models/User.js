const db = require('../../config/db')

const UserModel = {
    findByEmail:async(email)=>{
        const result = await db.query('SELECT * FROM user WHERE email = $1',[email]);
        return result.rows[0];
    },

    createUser: async(full_name,email,password_hash) => {
        const result = await db.query(
            'INSERT INTO users (full_name, email,password_hash) VALUES ($1,$2,$3) RETURNING *',
            [full_name,email,password_hash]
        );
        return result.rows[0];
    }
};
module.exports = UserModel;
