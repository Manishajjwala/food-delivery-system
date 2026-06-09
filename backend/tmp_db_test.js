const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log(`Attempting to connect to: ${process.env.MONGODB_URI}`);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connection established.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Connection failed!');
    console.error(err.message);
    process.exit(1);
  });

setTimeout(() => {
  console.log('TIMEOUT: Connection took too long.');
  process.exit(1);
}, 5000);
