const express = require('express');
const { adminAuth, clientAuth } = require('../middleware/auth');
const { creditWallet, debitWallet, getBalance } = require('../controllers/walletController');

const router = express.Router();

// Admin routes
router.post('/credit', adminAuth, creditWallet);
router.post('/debit',  adminAuth, debitWallet);

// Client route
router.get('/balance', clientAuth, getBalance);

module.exports = router;