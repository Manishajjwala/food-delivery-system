const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = 5001; // Use a different port to avoid conflict

app.get('/master', async (req, res) => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = 'admin@hungry.com';
    const password = 'adminpassword';
    let admin = await User.findOne({ email });
    
    if (!admin) {
      admin = await User.create({ name: 'Admin Master', email, password, role: 'admin' });
    } else {
      admin.password = password;
      admin.role = 'admin';
      await admin.save();
    }
    
    res.send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h1 style="color: #16a34a;">✅ ADMIN_RECOVERED_SUCCESSFULLY</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p>You can now log in at <a href="http://localhost:3000/admin">http://localhost:3000/admin</a></p>
      </div>
    `);
  } catch (err) {
    res.status(500).send(`<h1>❌ Recovery Failed</h1><p>${err.message}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`Recovery server running on http://localhost:${PORT}/master`);
});
