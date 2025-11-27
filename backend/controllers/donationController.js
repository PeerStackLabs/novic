const Donation = require('../models/Donation');

// @desc    Create a new donation (status: PENDING)
// @route   POST /api/donations
// @access  Private
const createDonation = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Please provide a valid amount' });
    }

    // Create donation with PENDING status
    const donation = new Donation({
      userId: req.user._id,
      email: req.user.email,
      amount,
      paymentStatus: 'PENDING',
    });

    await donation.save();

    res.status(201).json({
      message: 'Donation created successfully. Please complete payment.',
      donation: {
        id: donation._id,
        email: donation.email,
        amount: donation.amount,
        paymentStatus: donation.paymentStatus,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ error: 'Server error creating donation' });
  }
};

// @desc    Get all donations for current user
// @route   GET /api/donations
// @access  Private
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      donations: donations.map(d => ({
        id: d._id,
        email: d.email,
        amount: d.amount,
        paymentStatus: d.paymentStatus,
        verifiedAt: d.verifiedAt,
        createdAt: d.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ error: 'Server error fetching donations' });
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({
      donation: {
        id: donation._id,
        email: donation.email,
        amount: donation.amount,
        paymentStatus: donation.paymentStatus,
        verifiedAt: donation.verifiedAt,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ error: 'Server error fetching donation' });
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
};
