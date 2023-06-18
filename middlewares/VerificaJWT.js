require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

module.exports = {
  verify: async (req, res, next) => {
    
    if(!req.body.token) {
      return next();
    }
    
    try {

      const token = jwt.verify(req.body.token, `${process.env.SECRET}`); // aumentar esse tempo maximo.

      if(!await User.getUser(token.id)) res.json({ permission: false });

      const user = await User.getUser(token.id);
      res.json({ userData: { name: user.name, id: user.id } , permission: true });

    } catch(err) {

      console.log(err);
      res.json({ permission: false });

    }
  }
}