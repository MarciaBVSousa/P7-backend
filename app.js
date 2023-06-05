require('dotenv').config();

const express = require('express');
const app = express();

const db = require('./models/index');
//db.sequelize.sync();
db.sequelize.sync({ alter: true}).then(() => {
    console.log('Connected to PostgreSQL.');
});

const path = require('path');

const userRoutes = require('./routes/user');
const postRotes = require('./routes/post');
const profileRotes = require('./routes/profile');
const commentRotes = require('./routes/comment');

const helmet = require('helmet');
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);
app.use('/api/post', postRotes);
app.use('/api/profile', profileRotes);
app.use('/api/comment', commentRotes);


module.exports = app;
