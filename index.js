require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors')

const mongoose = require('mongoose');
const { config } = require('dotenv');

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(routes);
app.use(express.json());

mongoose.connect(`mongodb+srv://main:${process.env.PASSWORD}@api-task.hqglrla.mongodb.net/?retryWrites=true&w=majority`) 
  .then(() => {
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  })
  .catch((err) => console.log(err));