require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors')

const mongoose = require('mongoose');
const Task = require('./models/TaskModel');

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.post('/postTask', (req, res) => {

  console.log(req.body);
  const task = new Task({ title: req.query.title,
                          dt_start: req.query.dt_start,
                          dt_to_end: req.query.dt_to_end,
                          id_maker: req.query.id_maker });

  task.post();

  res.send('certo');

});

mongoose.connect(`mongodb+srv://main:${process.env.PASSWORD}@api-task.hqglrla.mongodb.net/?retryWrites=true&w=majority`) 
  .then(() => {
    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });
  })
  .catch((err) => console.log(err));