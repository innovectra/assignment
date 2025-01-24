const express = require('express');
const cors = require('cors');
const { router } = require('./router');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist/assighment')));
app.use(router);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/assighment/index.html'));
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
