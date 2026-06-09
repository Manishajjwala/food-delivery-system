// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 5000 // 5 seconds timeout
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message} - Server will continue running without immediate DB connection.`);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URL || "mongodb+srv://jhunjhunwalamanisha92_db_user:Of7VCUuqDeOtxq5l@cluster0.44sfch8.mongodb.net/hungry_db?retryWrites=true&w=majority";
    
    console.log("Connecting to MongoDB Atlas...");
    
    const conn = await mongoose.connect(url);
    console.log("MongoDB Atlas Connected Successfully to: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error: " + error.message);
  }
};

module.exports = connectDB;