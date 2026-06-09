const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.get('/api/test', (req, res) => res.json({ status: 'ok' }));
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
