const db = require('../../config/db')

const UserModel = {
    findByEmail: async(email) => {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    createUser: async(fullName, email, passwordHash) => {
        const result = await db.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [fullName, email, passwordHash]
        );
        return result.rows[0];
    }
};

module.exports = UserModel;
