require('dotenv').config();
const express = require('express');
const router = express.Router();

const JWTmiddleware = require('./middlewares/VerificaJWT');
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel');
const Task = require('./models/TaskModel');
const { config } = require('dotenv');

router.get('/login', JWTmiddleware.verify, async (req, res) => {

  const body = { email: req.headers.email, password: req.headers.password };
  const user = new User(body);
  await user.login();

  for(let key in user.errors) {
    if(user.errors[key]) {
      return res.json({ errors: user.errors, permission: false });
    }
  }

  res.json({ token: jwt.sign({ name: user.user.name, id: user.user.id }, `${config().parsed.SECRET}`),
             userData: { name: user.user.name, id: user.user.id },
             permission: true });

});

router.post('/register', async (req, res) => {

  const newUser = new User({ name: req.headers.name, 
                             email: req.headers.email, 
                             password: req.headers.password });

  const data = await newUser.register();

  for(let key in newUser.errors) {
    if(newUser.errors[key]) {
      res.json({ errors: newUser.errors, permission: false });
    }
  }

  let token = jwt.sign(data, `${config().parsed.SECRET}`);

  res.json({ token: token, 
             userData: data, 
             permission: true });

});

router.post('/postTask', (req, res) => {

  const task = new Task({ title: req.headers.title,
                          dt_start: req.headers.dt_start,
                          dt_to_end: req.headers.dt_to_end,
                          id_maker: req.headers.id_maker })

  task.post();

  res.send('certo');

});

router.get('/getTasks', async (req, res) => {

  res.json({ tasks: await Task.getTasks(req.headers.id_maker) })

})

module.exports = router;