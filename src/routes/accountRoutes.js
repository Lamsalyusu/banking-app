const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authmiddleware = require('../middleware/authMiddleware');

router.post('/getBalance',authmiddleware,accountController.getBalance);
router.post('/withdraw',authmiddleware,accountController.withdraw);
router.post('/transfer',authmiddleware,accountController.transfer);
router.post('/getTrasactions',authmiddleware,accountController.getTransactions);

module.exports = router;