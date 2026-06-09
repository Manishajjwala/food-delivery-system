const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/hungry_db').then(async () => {
  try {
    const user = await User.create({ name: 'Bob', email: 'bob@example.com', password: '123' });
    console.log("Success:", user);
  } catch (err) {
    console.error("Failed:", err.message);
  }
  process.exit();
});
