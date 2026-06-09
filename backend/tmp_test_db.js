const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('CONNECTED successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('CONNECTION FAILED:', err.message);
    process.exit(1);
  });

// Force exit after 10s
setTimeout(() => {
  console.log('CONNECTION TIMEOUT');
  process.exit(1);
}, 10000);
