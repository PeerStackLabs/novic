const express = require('express');
const auth = require('../middleware/auth');
const { createDonation, getAllDonations, getDonationById } = require('../controllers/donationController');

const router = express.Router();

// @route   POST /api/donations
// @desc    Create a new donation (status: PENDING)
// @access  Private
router.post('/', auth, createDonation);

// @route   GET /api/donations
// @desc    Get all donations for current user
// @access  Private
router.get('/', auth, getAllDonations);

// @route   GET /api/donations/:id
// @desc    Get single donation by ID
// @access  Private
router.get('/:id', auth, getDonationById);

module.exports = router;
