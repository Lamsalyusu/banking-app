const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authmiddleware = require('../middleware/authMiddleware');

router.get('/getBalance',authmiddleware,accountController.getBalance);
router.post('/deposit',authmiddleware,accountController.deposit)
router.post('/withdraw',authmiddleware,accountController.withdraw);
router.post('/transfer',authmiddleware,accountController.transfer);
router.get('/getTransactions',authmiddleware,accountController.getTransactions);

module.exports = router;