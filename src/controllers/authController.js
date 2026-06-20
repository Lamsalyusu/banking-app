const UserModel = require('../models/User');
const AccountModel = require('../models/AccountModel');
const generateAccountNumber = require('../utils/generateAccountNumber');

const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
// const { use } = require('react');


const authController = {
    // registering a new user + bank 
    register : async(req , res)=>{
        try {
            const {fullName, email , password} =req.body;
            const existinguser = await UserModel.findByEmail(email);

            if (existinguser)
            {
                return res.status(400).json({error:'Email already registered'});
            }
            
            const  salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const userResult = await UserModel.createUser(fullName, email,passwordHash);
            const newUser = userResult;

            const accountnum = generateAccountNumber();
            const accountResult = await AccountModel.create(newUser.id,accountnum,100);

            res.status(201).json({
                message:'User and account created successfully',
                user:newUser,
                account:accountResult[0]
            });

        }catch(error){
            res.status(500).json({error:error.message});
        }
    },

    login:async(req,res)=>{
        try
         {

            const {email,password} = req.body;
            const userResult = await UserModel.findByEmail(email);
            if (!userResult){
                return res.status(401).json({error:'invalid email or password'});
        }

            const user = userResult;
            const ismatch = await bcrypt.compare(password,user.password_hash);
            if (!ismatch){
                return res.status(401).json({error:'invalid email or password'});
        
        }


            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message:'Login successful',
                token,
                user:{id:user.id, fullName:user.full_name, email:user.email}
            
        
        });
        
        }
        catch (error)
        
        {
            res.status(500).json({error:error.message});
        }
    }
    
};

module.exports = authController;
