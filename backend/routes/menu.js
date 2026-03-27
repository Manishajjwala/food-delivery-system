const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
