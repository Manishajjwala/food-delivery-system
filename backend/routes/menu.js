const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const { adminProtect } = require('../middleware/authMiddleware');

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

// @route   POST api/menu
// @desc    Add a new menu item
// @access  Admin
router.post('/', adminProtect, async (req, res) => {
  const { name, category, price, rating, image, variants } = req.body;
  try {
    const newItem = new FoodItem({ 
      name, 
      category, 
      price, 
      rating: rating || 0, 
      image,
      variants: variants || []
    });
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Admin
router.put('/:id', adminProtect, async (req, res) => {
  const { name, category, price, rating, image, variants } = req.body;
  try {
    let item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.name = name || item.name;
    item.category = category || item.category;
    item.price = price !== undefined ? price : item.price;
    item.rating = rating !== undefined ? rating : item.rating;
    item.image = image || item.image;
    item.isAvailable = (req.body.isAvailable !== undefined) ? req.body.isAvailable : item.isAvailable;
    item.variants = variants || item.variants;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Admin
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
