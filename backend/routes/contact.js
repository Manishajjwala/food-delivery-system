const express = require('express');
const router = express.Router();

// @route   POST /api/contact
// @desc    Receive contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // For now, we'll just log it to the console. 
    // In a real app, you might save to DB or send an email.
    console.log(`New Contact Message from ${name} (${email}): ${message}`);
    
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
