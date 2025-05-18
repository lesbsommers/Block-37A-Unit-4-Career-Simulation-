require('dotenv').config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");

//middleware and routes setup
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const reviewsRoutes = require('./routes/reviews');
const commentsRoutes = require('./routes/comments');

app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api', reviewsRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;