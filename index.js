require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');

const mongoose = require('mongoose');
const Task = require('./models/TaskModel');

app.use(cors({
  origin: 'https://master-task-pollar.vercel.app/'
}));
app.use(routes);

mongoose.connect(`mongodb+srv://main:${process.env.PASSWORD}@api-task.hqglrla.mongodb.net/?retryWrites=true&w=majority`) 
  .then(() => {
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  })
  .catch((err) => console.log(err));
