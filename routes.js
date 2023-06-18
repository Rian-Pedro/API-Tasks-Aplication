require('dotenv').config();
const express = require('express');
const router = express.Router();

const JWTmiddleware = require('./middlewares/VerificaJWT');
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel');
const Task = require('./models/TaskModel');

router.use(express.json());
router.use(express.urlencoded({extended:true}));

router.get('/login', JWTmiddleware.verify, async (req, res) => {

  const body = { email: req.query.email, password: req.query.password };
  const user = new User(body);
  await user.login();

  for(let key in user.errors) {
    if(user.errors[key]) {
      return res.json({ errors: user.errors, permission: false });
    }
  }

  res.json({ token: jwt.sign({ name: user.user.name, id: user.user.id }, `${process.env.SECRET}`),
             userData: { name: user.user.name, id: user.user.id },
             permission: true });

});

router.post('/register', async (req, res) => {

  const newUser = new User({ name: req.body.name, 
                             email: req.body.email, 
                             password: req.body.password });

  const data = await newUser.register();

  for(let key in newUser.errors) {
    if(newUser.errors[key]) {
      res.json({ errors: newUser.errors, permission: false });
    }
  }

  let token = jwt.sign(data, `${process.env.SECRET}`);

  res.json({ token: token, 
             userData: data, 
             permission: true });

});

router.post('/postTask', (req, res) => {
  
    const task = new Task({ title: req.body.title,
                            dt_start: req.body.dt_start,
                            dt_to_end: req.body.dt_to_end,
                            id_maker: req.body.id_maker })

    task.post();

    res.json({ status: "certo" });
});

router.get('/getTasks', async (req, res) => {

  res.json({ tasks: await Task.getTasks(req.query.id_maker) })

})

module.exports = router;
